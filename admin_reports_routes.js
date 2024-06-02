const express = require("express");
const adminRoutes = express.Router();
const Basket = require("./models/basket");
const aggregationPipelines = require("./aggregation_pipelines")
const Comments =  require("./models/comment")
const mongoose = require("mongoose");





adminRoutes.get("/financialreportusers", async (req, res) =>{
    const pipeline = aggregationPipelines.financialReportUsers()
    try {
        const result = await Basket.aggregate(pipeline);
        res.json(result);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }

})


// do dodania np. zwrot z roznych produktow / roznych 
// walidacja do zrobienia
// wykresy









module.exports = adminRoutes;