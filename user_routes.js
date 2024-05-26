const express = require("express");
const userRoutes = express.Router();
const User = require("./models/user");
const Basket = require("./models/basket");
const mongoose = require('mongoose');

const aggregationPipelines = require("./aggregation_pipelines");
const { ObjectId } = require("mongodb");

userRoutes.get("/allusers", (req, res) => {
  User.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

userRoutes.get("/searchuser", (req, res) => {
  const { firstname, lastname, username, email, city, zipcode } = req.query;

  const searchCriteria = {};

  if (firstname) searchCriteria.firstname = firstname;
  if (lastname) searchCriteria.lastname = lastname;
  if (username) searchCriteria.username = username;
  if (email) searchCriteria.email = email;
  if (city) searchCriteria["address.city"] = city;
  if (zipcode) searchCriteria["address.zipcode"] = zipcode;

  User.find(searchCriteria)
    .then((users) => {
      res.send(users);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Wystąpił błąd podczas wyszukiwania użytkowników.");
    });
});


userRoutes.get("/userbaskets/:userId", async (req, res) => {
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



module.exports = userRoutes;
