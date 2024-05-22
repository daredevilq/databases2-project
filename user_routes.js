const express = require("express");
const userRoutes = express.Router();
const User = require("./models/user");
const Basket = require("./models/basket");

const aggregationPipelines = require("./aggregation_pipelines");

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
  console.log(userId);
  try {
    const aggregationPipeline =
      aggregationPipelines.matchAllBasketsWithGivenUserID(userId);
    
    const result = await Basket.aggregate(aggregationPipeline);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Wystąpił błąd serwera" });
  }
})

module.exports = userRoutes;
