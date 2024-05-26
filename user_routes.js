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




// userRoutes.get("/userbaskets/:userId", async (req, res) => {
//   const { userId } = req.params;
//   try {
//     // Znajdź użytkownika po userId
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Znajdź wszystkie koszyki dla danego użytkownika
//     const baskets = await Basket.find({ user_id: userId });
//     console.log(baskets)
//     let totalValue = 0;

//     for (const basket of baskets) {
//       for (const productId of basket.products) {
//         const product = await Product.findById(productId);
//         if (product) {
//           totalValue += product.price;
//         }
//       }
//     }

//     // Tworzenie odpowiedzi
//     const response = {
//       user: {
//         firstname: user.firstname,
//         lastname: user.lastname,
//       },
//       baskets: baskets,
//       totalValue: totalValue,
//     };

//     res.json(response);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });


userRoutes.get("/userbaskfhgets/:userId", async (req, res) => {
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
