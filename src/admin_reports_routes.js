const express = require("express");
const adminRoutes = express.Router();
const Basket = require("./models/basket");
const aggregationPipelines = require("./aggregation_pipelines")
const Comments =  require("./models/comment")
const mongoose = require("mongoose");
const User = require("./models/user");
const authorization = require("./authorization")
const ROLES = require("./roles_list")

//const chartsSDK = require('@mongodb-js/charts-embed-dom')
//import ChartsEmbedSDK from '@mongodb-js/charts-embed-dom';
const ChartsEmbedSDK = require('@mongodb-js/charts-embed-dom').default;



adminRoutes.get("/financialreportusers", authorization.authenticateToken, authorization.authorizeRoles([ROLES.ADMIN]),async (req, res) =>{
	const pipeline = aggregationPipelines.financialReportUsers()
	try {
		const result = await Basket.aggregate(pipeline);
		res.json(result);
	  } catch (err) {
		res.status(500).json({ message: err.message });
	  }

})



adminRoutes.get('/customers-around-world', authorization.authenticateToken, authorization.authorizeRoles([ROLES.ADMIN]), async (req, res) =>{

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

adminRoutes.get('/orders-week',authorization.authenticateToken, authorization.authorizeRoles([ROLES.ADMIN]), async (req, res) => {
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


adminRoutes.get('/orders-month-periodic', async (req, res) =>{
	try{
		const link = "https://charts.mongodb.com/charts-data-bases2-project-byelmxs/embed/charts?id=6668bae5-325c-45ec-8dc8-308c05c8aaca&maxDataAge=300&theme=light&autoRefresh=true"

		const pipeline = aggregationPipelines.ordersMonthlyPeriodic();
		const data = await Basket.aggregate(pipeline)
		data.push({chatLink : link})
		res.send(data)

	}catch{
		console.error('Failed to get data from chart:', error.message);
		console.error('Stack trace:', error.stack);
		res.status(500).send('Failed to get data from chart');
	}
})



adminRoutes.get('/orders-month', async (req, res) =>{
	try{
		const link = "https://charts.mongodb.com/charts-data-bases2-project-byelmxs/embed/charts?id=6668bf57-0dc0-4b69-8eaf-3a41f25b836d&maxDataAge=300&theme=light&autoRefresh=true"

		const pipeline = aggregationPipelines.ordersMonthly();
		const data = await Basket.aggregate(pipeline)
		data.push({chatLink : link})
		res.send(data)

	}catch{
		console.error('Failed to get data from chart:', error.message);
		console.error('Stack trace:', error.stack);
		res.status(500).send('Failed to get data from chart');
	}
})


adminRoutes.get('/usersnumber', async (req, res)=>{
	try{
		const link = `https://charts.mongodb.com/charts-data-bases2-project-byelmxs/embed/charts?id=6668c275-6ca1-4125-8fcf-c8c74c59a5b0&maxDataAge=300&theme=light&autoRefresh=true`
		
		const data = await User.aggregate([{$count: "totalUsers"}])
		data.push({chartLink: link})
		res.send(data)
		
	}catch{
		console.error('Failed to get data from chart:', error.message);
		console.error('Stack trace:', error.stack);
		res.status(500).send('Failed to get data from chart');
	}
})

adminRoutes.get('/dashboard', authorization.authenticateToken, authorization.authorizeRoles([ROLES.ADMIN]), (req, res) =>{
	const link = `https://charts.mongodb.com/charts-data-bases2-project-byelmxs/public/dashboards/665ddbee-7ec1-418e-8b22-c4ebd96d3c04`

	res.send(link)
})





// do dodania np. zwrot z roznych produktow / roznych 
// walidacja do zrobienia
// wykresy









module.exports = adminRoutes;