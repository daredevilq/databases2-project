const express = require("express");
const logsRoutes = express.Router();
const Logs = require("../models/log");
const mongoose = require('mongoose');
const helperFunctions = require('../helper_functions')
const bcrypt = require('bcrypt')
const authorization = require('../authorization')
const ROLES = require('../roles_list')
const aggregationPipelines = require('../aggregation_pipelines')

logsRoutes.get('/my-logs',authorization.authenticateToken, authorization.authorizeRoles([ROLES.ADMIN, ROLES.CUSTOMER]), async (req, res)=>{

	const userId = req.user.user._id;
	const aggregationPipeline = aggregationPipelines.getLogsForUser(userId)
	try{
			const answ = await Logs.aggregate(aggregationPipeline)
			res.json(answ)
	}catch(error){
			console.error(error);
			res.status(500).json({ message: "Wystąpił błąd serwera" });
	}

})



module.exports = logsRoutes


