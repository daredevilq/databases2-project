const express = require("express");
const commentRoutes = express.Router();
const Product = require("./models/product");
const aggregationPipelines = require("./aggregation_pipelines")
const Comments =  require("./models/comment")
const mongoose = require("mongoose");
const helperFunctions = require('./helper_functions')
const authorization = require('./authorization')
const ROLES = require('./roles_list')

commentRoutes.use(express.json())

commentRoutes.get("/user-comments/:userId", async (req, res) =>{
		const { userId } = req.params;

		const aggregationPipeline = aggregationPipelines.searchAllUserComments(userId)
		try{
				const answ = await Comments.aggregate(aggregationPipeline)

				res.json(answ)
		}catch(error){
				console.error(error);
				res.status(500).json({ message: "Wystąpił błąd serwera" });
		}
})

commentRoutes.get("/my-reviews", authorization.authenticateToken, authorization.authorizeRoles([ROLES.ADMIN, ROLES.CUSTOMER]), async (req, res) =>{
	
	const userId = req.user.user._id;
	const aggregationPipeline = aggregationPipelines.searchAllUserComments(userId)
	try{
			const answ = await Comments.aggregate(aggregationPipeline)

			res.json(answ)
	}catch(error){
			console.error(error);
			res.status(500).json({ message: "Wystąpił błąd serwera" });
	}
})


commentRoutes.post('/add-review', async (req, res) => {
		const { product_id, customer_id, rating, review } = req.body;
		try {
			const newReview = new Comments({
				product_id: new mongoose.Types.ObjectId(product_id),
				customer_id: new mongoose.Types.ObjectId(customer_id),
				rating,
				review,
				date: new Date(),
				comments: [],
			});
	
			const savedReview = await newReview.save();
			res.status(201).json(savedReview);
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Wystąpił błąd serwera" });
		}
	});


	commentRoutes.post('/add-comment/:reviewId', async (req, res) => {
		const { reviewId } =req.params;
		const objectReviewId =  new mongoose.Types.ObjectId(reviewId)
		const { userid, comment } = req.body

		try {
			const review = await Comments.findById(objectReviewId);
			if (!review) {
				return res.status(404).json({ message: "Recenzja nie została znaleziona" });
			}
	
			review.comments.push({
				userid,
				comment
			});
	
			const updatedReview = await review.save();
			res.status(201).json(updatedReview);
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Wystąpił błąd serwera" });
		}
	});


module.exports = commentRoutes;