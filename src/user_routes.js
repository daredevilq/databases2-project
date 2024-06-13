const express = require("express");
const userRoutes = express.Router();
const User = require("./models/user");
const Basket = require("./models/basket");
const mongoose = require('mongoose');
const helperFunctions = require('./helper_functions')
const bcrypt = require('bcrypt')
const authorization = require('./authorization')
const ROLES = require('./roles_list')

const aggregationPipelines = require("./aggregation_pipelines");
const { ObjectId } = require("mongodb");

userRoutes.get("/allusers", authorization.authenticateToken, authorization.authorizeRoles([ROLES.ADMIN]), (req, res) => {
	User.find()
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			console.log(err);
		});
});






userRoutes.get("/searchuser", authorization.authenticateToken, authorization.authorizeRoles([ROLES.ADMIN]),(req, res) => {
	const { firstname, lastname, username, email, city, zipcode, country } = req.query;

	const searchCriteria = {};

	if (firstname) searchCriteria.firstname = firstname;
	if (lastname) searchCriteria.lastname = lastname;
	if (username) searchCriteria.username = username;
	if (email) searchCriteria.email = email;
	if (city) searchCriteria["address.city"] = city;
	if (zipcode) searchCriteria["address.zipcode"] = zipcode;
	if (country) searchCriteria["address.country"] = country;

	User.find(searchCriteria)
		.then((users) => {
			res.send(users);
		})
		.catch((error) => {
			console.log(error);
			res.status(500).send("Wystąpił błąd podczas wyszukiwania użytkowników.");
		});
});


userRoutes.get("/userbaskets/:userId",authorization.authenticateToken, authorization.authorizeRoles([ROLES.ADMIN]),async (req, res) => {
	
	const { userId } = req.params;
	const aggregationPipeline =
	aggregationPipelines.matchAllBasketsWithGivenUserID(userId);

	try {
		const result = await Basket.aggregate(aggregationPipeline);
		res.json(result);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});


userRoutes.get("/userbasketsdetails", async (req, res) => {
	const {
		userId,
		mintotalvalue,
		maxtotalvalue,
		numberofproducts,
		deliverystatus,
		status,
		timestamp,
		title,
		brand,
		category,
	} = req.query;

	let pipeline = aggregationPipelines.matchAllBasketsDetailed(userId, title, brand, category);

	// Additional filters
	if (mintotalvalue || maxtotalvalue) {
		pipeline.push({
			$match: {
				totalValue: {
					...(mintotalvalue ? { $gte: parseFloat(mintotalvalue) } : {}),
					...(maxtotalvalue ? { $lte: parseFloat(maxtotalvalue) } : {})
				}
			}
		});
	}

	if (numberofproducts) {
		pipeline.push({
			$match: {
				'baskets.products': {
					$size: parseInt(numberofproducts, 10)
				}
			}
		});
	}
	
	if (deliverystatus) {
		pipeline.push({
			$match: {
				'baskets.delivery_status': deliverystatus
			}
		});
	}
	
	if (status) {
		pipeline.push({
			$match: {
				'baskets.transaction.status': status
			}
		});
	}
	
	if (timestamp) {
		const date = new Date(timestamp);
		pipeline.push({
			$match: {
				'transaction.timestamp': { $gte: date }
			}
		});
	}
	
	try {
		const result = await Basket.aggregate(pipeline);
		res.json(result);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});


userRoutes.post("/createbasket/", authorization.authenticateToken, authorization.authorizeRoles([ROLES.ADMIN, ROLES.CUSTOMER]) ,async (req, res) => {
	// format for sending products is: products:id_1;id_2;id_2
	// as you see we are using const productIds = products.split(';');
	const userId = req.user.user._id
	const {products, currency, payment_method,status, delivery_status } = req.body;

	if(!products){
		res.status(500).json({ message: "You must provide products" });
	}

	const productsArr = products.split(';');
	try {

		const productsAvailbility = await helperFunctions.checkWhetherProductsAreAvailable(productsArr) 
		if(!productsAvailbility){
			res.status(500).json({ message: "One of the products is not available" });
		}

		const decreasingResult = await helperFunctions.decreaseProductQuantity(productsArr)

		if(!decreasingResult){
			res.status(500).json({ message: "Cant decrese products quantity" });
		}

		const newBasket = new Basket({
			user_id: new mongoose.Types.ObjectId(userId),
			date_time: new Date(),
			products: productsArr.map(productId => new mongoose.Types.ObjectId(productId)),
			transaction: {
				currency,
				payment_method,
				status,
				timestamp: new Date(),
			},
			delivery_status,
		});


		const savedBasket = await newBasket.save();

		res.status(201).json(savedBasket);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Wystąpił błąd serwera" });
	}
});





userRoutes.put("/updatebasket/:basketId", authorization.authenticateToken, authorization.authorizeRoles([ROLES.ADMIN]),async (req, res) => {
	const { basketId } = req.params;
	const { products, delivery_status, transaction_status } = req.body;

	try {
		const basketObjectId = new mongoose.Types.ObjectId(basketId)
		const basket = await Basket.findById(basketObjectId);

		
		if (!basket) {
			return res.status(404).json({ message: "Koszyk nie został znaleziony" });
		}

		if (products) {
			const productsArray = products.split(';');
			
			basket.products = [...basket.products, ...productsArray.map(productId => new mongoose.Types.ObjectId(productId))];
		}

		if (delivery_status) {
			basket.delivery_status = delivery_status;
		}

		if (transaction_status) {
			basket.transaction.status = transaction_status;
			basket.transaction.timestamp = new Date();
		}

		const updatedBasket = await basket.save();
		res.status(200).json(updatedBasket);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Wystąpił błąd serwera" });
	}
});



userRoutes.post('/change-user-password', authorization.authenticateToken, authorization.authorizeRoles([ROLES.ADMIN]), async (req, res) =>{
	try{
		const { email, newPassword } = req.body;

		if (!email || !newPassword) {
			return res.status(400).send('Email and password are required');
		}

		const user = await User.findOne({email: email})
		
		if (!user) {
			return res.status(404).send('User not found');
		}
		
		const salt = await bcrypt.genSalt()
		const hashedPassword = await bcrypt.hash(newPassword, salt)
		
		user.password = hashedPassword;
		await user.save();
		res.status(200).send('Password updated successfully');
	}
	catch(error){
		console.error("Error updating password:", error);
		res.status(500).send('An error occurred while updating the password');
	}
})



userRoutes.post('/register-user', async (req, res) => {
	try {
		const {
			firstname,
			lastname,
			username,
			email,
			password,
			country, street, suite, city, zipcode,
			phone
		} = req.body;
		const role = ROLES.CUSTOMER
		if (!firstname || !lastname || !username || !email || !password || !country || !street || !city || !zipcode || !phone) {
			return res.status(400).send('All required fields must be provided');
		}

		const existingUser = await User.findOne({ email: email });
		const existingUserUsername = await User.findOne({username: username})
		if (existingUser || existingUserUsername) {
			return res.status(409).send('User with this email already exists');
		}


		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({
			firstname,
			lastname,
			username,
			email,
			password: hashedPassword,
			role: role,
			address: {
				country,
				street,
				suite,
				city,
				zipcode
			},
			phone
		});
		await newUser.save();

		res.status(201).send('User created successfully');
	} catch (error) {
		console.error("Error creating user:", error);
		res.status(500).send('An error occurred while creating the user');
	}
});




userRoutes.post('/register-admin',authorization.authenticateToken, authorization.authorizeRoles([ROLES.ADMIN]), async (req, res) => {
	try {
		const {
			firstname,
			lastname,
			username,
			email,
			password,
			country, street, suite, city, zipcode,
			phone
		} = req.body;
		const role = ROLES.ADMIN
		if (!firstname || !lastname || !username || !email || !password || !country || !street || !city || !zipcode || !phone) {
			return res.status(400).send('All required fields must be provided');
		}

		const existingUser = await User.findOne({ email: email });
		const existingUserUsername = await User.findOne({username: username})
		if (existingUser || existingUserUsername) {
			return res.status(409).send('User with this email already exists');
		}


		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({
			firstname,
			lastname,
			username,
			email,
			password: hashedPassword,
			role: role,
			address: {
				country,
				street,
				suite,
				city,
				zipcode
			},
			phone
		});
		await newUser.save();

		res.status(201).send('User created successfully');
	} catch (error) {
		console.error("Error creating user:", error);
		res.status(500).send('An error occurred while creating the user');
	}
});





module.exports = userRoutes;
