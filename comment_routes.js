const express = require("express");
const commentRoutes = express.Router();
const Product = require("./models/product");
const aggregationPipelines = require("./aggregation_pipelines")
const Comments =  require("./models/comment")


commentRoutes.get("/usercomments/:userId", (req, res) =>{
    
})