const express = require("express");
const adminRoutes = express.Router();
const Basket = require("./models/basket");
const aggregationPipelines = require("./aggregation_pipelines")
const Comments =  require("./models/comment")
const mongoose = require("mongoose");
const User = require("./models/user");

//const chartsSDK = require('@mongodb-js/charts-embed-dom')
//import ChartsEmbedSDK from '@mongodb-js/charts-embed-dom';
const ChartsEmbedSDK = require('@mongodb-js/charts-embed-dom').default;



adminRoutes.get("/financialreportusers", async (req, res) =>{
    const pipeline = aggregationPipelines.financialReportUsers()
    try {
        const result = await Basket.aggregate(pipeline);
        res.json(result);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }

})



adminRoutes.get('/customers-around-world', async (req, res) =>{

    const pipeline = aggregationPipelines.countCoustomersInCountries()
    const result = await User.aggregate(pipeline)


    const link = "https://charts.mongodb.com/charts-data-bases2-project-byelmxs/embed/charts?id=665e02ff-48ce-4134-8f3e-c57f6f29977a&maxDataAge=300&theme=light&autoRefresh=true"
    
    result.push({ chartLink: link });
    res.send(result)

})


adminRoutes.get('/orders-weekTODO', async (req, res) => {
    try {
    const sdk = new ChartsEmbedSDK({
        baseUrl: 'https://charts.mongodb.com/charts-data-bases2-project-byelmxs',
    });
    
    const chart = sdk.createChart({
        chartId: '665e333d-22bc-4575-81c1-3e8617de4d6e',
    });

       
        chart.render(document.getElementById('chart'));
        console.log('Attempting to get data from chart with ID:', chart.chartId);
        const data = await chart.getData();
        console.log('Data received:', data);
        res.send(data);
    } catch (error) {
        console.error('Failed to get data from chart:', error.message);
        console.error('Stack trace:', error.stack);
        res.status(500).send('Failed to get data from chart');
    }
});

adminRoutes.get('/orders-week', async (req, res) => {
    try {
        const pipeline = aggregationPipelines.ordersWeekly()
        const link = "https://charts.mongodb.com/charts-data-bases2-project-byelmxs/embed/charts?id=665e333d-22bc-4575-81c1-3e8617de4d6e&maxDataAge=3600&theme=light&autoRefresh=true"
        const data = await Basket.aggregate(pipeline)
        data.push({chartLink : link})
        res.send(data)
    } catch (error) {
        console.error('Failed to get data from chart:', error.message);
        console.error('Stack trace:', error.stack);
        res.status(500).send('Failed to get data from chart');
    }
});





adminRoutes.get('/dashboard', (req, res) =>{
    const link = `https://charts.mongodb.com/charts-data-bases2-project-byelmxs/public/dashboards/665ddbee-7ec1-418e-8b22-c4ebd96d3c04`

    res.send(link)
})


// do dodania np. zwrot z roznych produktow / roznych 
// walidacja do zrobienia
// wykresy









module.exports = adminRoutes;