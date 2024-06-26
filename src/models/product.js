const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	id: {
		type: Number,
		required: false,
	},
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	discountPercentage: {
		type: Number,
		required: true,
	},
	rating: {
		type: Number,
		required: true,
	},
	stock: {
		type: Number,
		required: true,
	},
	brand: {
		type: ObjectId,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	thumbnail: {
		type: String,
		required: false,
	},
	images: {
		type: [String],
		required: false,
	},
});

module.exports = mongoose.model("Product", productSchema);
