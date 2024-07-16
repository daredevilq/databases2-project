const express = require("express");
const Product = require("./models/product");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const ROLES = require('./roles_list')



async function checkWhetherProductsAreAvailable(productsIDs) {
	try {
		for (const productID of productsIDs) {
			const objectProductID = new mongoose.Types.ObjectId(productID);
			const product = await Product.findById( objectProductID);
			if (!product || product.stock <= 0) {
				return false;
			}
		}
		return true;
	} catch (error) {
		console.error("Error occurred while checking product availability:", error);
		return false;
	}
}

async function decreaseProductQuantity(productsIDs) {
	try {
		for (const productID of productsIDs) {
			const objectProductID = new mongoose.Types.ObjectId(productID);
			const product = await Product.findById(objectProductID);
			
			if (!product) {
				console.error(`Product with ID ${productID} not found`);
				return false;
			}

			if (product.stock <= 0) {
				console.error(`Product with ID ${productID} is out of stock`);
				return false;
			}
			product.stock -= 1;
			await product.save();
		}
		return true;
	} catch (error) {
		console.error("Error occurred while decreasing product quantity:", error);
		return false;
	}
}


module.exports = {checkWhetherProductsAreAvailable,
				 decreaseProductQuantity
				}