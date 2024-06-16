const express = require("express");
const productRoutes = express.Router();
const Product = require("./models/product");
const aggregationPipelines = require("./aggregation_pipelines")
const Comments =  require("./models/comment")
const authorization = require('./authorization')
const ROLES = require('./roles_list')
const mailSender = require('./mail_sender');
const sendingMail = require("./mail_sender");
const { default: mongoose } = require("mongoose");


productRoutes.get("/all-products", (req, res) => {
	Product.find()
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			console.log(err);
		});
});

//BRAND TO DO
productRoutes.post("/search-products", async (req, res) => {
	try {
		console.log(req.body)
		const {
			title,
			//brand,
			category,
			minPrice,
			maxPrice,
			minRating,
			maxRating,
			minDiscountPercentage,
			maxDiscountPercentage,
			minStock,
			maxStock,
		} = req.body;

		const searchCriteria = {};

		if (title) searchCriteria.title = { $regex: title, $options: "i" };
		//if (brand) searchCriteria.brand = { $regex: brand, $options: "i" };
		if (category) searchCriteria.category = { $regex: category, $options: "i" };
		if (minPrice && maxPrice) {
			searchCriteria.price = { $gte: minPrice, $lte: maxPrice };
		} else if (minPrice) {
			searchCriteria.price = { $gte: minPrice };
		} else if (maxPrice) {
			searchCriteria.price = { $lte: maxPrice };
		}
		if (minRating) searchCriteria.rating = { $gte: minRating };
		if (maxRating) searchCriteria.rating = { $lte: maxRating };
		if (minDiscountPercentage)
			searchCriteria.discountPercentage = { $gte: minDiscountPercentage };
		if (maxDiscountPercentage)
			searchCriteria.discountPercentage = { $lte: maxDiscountPercentage };
		if (minStock) searchCriteria.stock = { $gte: minStock };
		if (maxStock) searchCriteria.stock = { $lte: maxStock };

		const products = await Product.find(searchCriteria);
		
		res.json(products);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Wystąpił błąd serwera" });
	}
});


productRoutes.post("/add-product", authorization.authenticateToken, authorization.authorizeRoles([ROLES.ADMIN]), async (req, res) => {
	try {
		const productData = req.body; 
		const newProduct = new Product(productData); 
		const savedProduct = await newProduct.save();

		if(savedProduct.discountPercentage >= 20){
			const answ = sendingMail.mailSenderToAll()
		}

		res.status(201).json(savedProduct); 
	} catch (error) {
		console.error("Error creating product:", error);
		res
			.status(500)
			.json({ message: "Wystąpił błąd serwera podczas tworzenia produktu" });
	}
});


productRoutes.get("/products/:productId/all-reviews", async (req, res) => {
	const { productId } = req.params;

	const objectProductId = new mongoose.Types.ObjectId(productId)

	try {
		const aggregationPipeline =
			aggregationPipelines.matchAllProductsWithGivenID(objectProductId);
		
		console.log(aggregationPipeline);
		const result = await Comments.aggregate(aggregationPipeline);
		res.json(result);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Wystąpił błąd serwera" });
	}
});


productRoutes.post('/update-discount',authorization.authenticateToken, authorization.authorizeRoles([ROLES.ADMIN]), async (req, res) => {
  const { productId, discountPercentage } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: { discountPercentage } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Produkt nie znaleziony' });
    }

	if (discountPercentage >= 20 && updatedProduct) {
		await sendingMail(updatedProduct); 
	  }
  
    res.json(updatedProduct); 
  } catch (error) {
    console.error('Error updating product discount:', error);
    res.status(500).json({ message: 'Wystąpił błąd serwera podczas aktualizacji rabatu produktu' });
  }
});


module.exports = productRoutes;
