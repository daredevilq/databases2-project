const express = require("express");
const userRoutes = express.Router();
const User = require("./models/user");

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

module.exports = userRoutes;
