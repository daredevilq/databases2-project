const express = require("express");
const productRoutes = express.Router();
const Product = require("./models/product");
const aggregationPipelines = require("./aggregation_pipelines")
const Comments =  require("./models/comment")
productRoutes.get("/allproducts", (req, res) => {
  Product.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});


productRoutes.get("/searchproducts", async (req, res) => {
  try {
    const {
      title,
      brand,
      category,
      minPrice,
      maxPrice,
      minRating,
      maxRating,
      minDiscountPercentage,
      maxDiscountPercentage,
      minStock,
      maxStock,
    } = req.query;

    const searchCriteria = {};

    if (title) searchCriteria.title = { $regex: title, $options: "i" };
    if (brand) searchCriteria.brand = { $regex: brand, $options: "i" };
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


productRoutes.post("/addproduct", async (req, res) => {
  try {
    const productData = req.body; 
    const newProduct = new Product(productData); 
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct); 
  } catch (error) {
    console.error("Error creating product:", error);
    res
      .status(500)
      .json({ message: "Wystąpił błąd serwera podczas tworzenia produktu" });
  }
});


productRoutes.get("/products/:productId/allreviews", async (req, res) => {
  const { productId } = req.params;

  try {
    const aggregationPipeline =
      aggregationPipelines.matchAllProductsWithGivenID(productId);
    
    console.log(aggregationPipeline);
    const result = await Comments.aggregate(aggregationPipeline);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Wystąpił błąd serwera" });
  }
});



module.exports = productRoutes;
