require('dotenv').config()
const mongodb = require('mongodb');
const express = require('express');
const User = require('./models/user');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const ROLES = require('./roles_list')
const authenticationRoutes = express.Router();
const Logs = require("./models/log");
const mongoose = require('mongoose');
const authorization = require('./authorization')


authenticationRoutes.post('/login', async (req, res) => {
    try {
      const { email, password} = req.body;
  
      const user = await User.findOne({ email: email });
      if (user == null) {
        return res.status(400).send('Cannot find user with given email');
      }
  
      if (!await bcrypt.compare(password, user.password)) {
        return res.status(400).send('Wrong password');
      }
  
      const accessToken = jwt.sign(
        { user : user },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '20m' }
      );
      
      console.log(new Date())

      const newLog = new Logs({
        user_id: user._id, 
        action_type: 'login',
        time: new Date()
      });
      

      const savedLog = await newLog.save();
      console.log(savedLog)
      res.status(201).json({ accessToken: accessToken });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).send('An error occurred during login');
    }
  });
  
authenticationRoutes.get('/tttest', async (req, res) =>{
    res.send(await Logs.find())
})


authenticationRoutes.get('/logout',authorization.authenticateToken, async (req, res) => {
    try {
    
        const denyToken =jwt.sign(
        { user : req.user.user },
        process.env.DENY_TOKEN_SECRET,
        { expiresIn: '2s' }
      );


      const newLog = new Logs({
        user_id: req.user.user._id, 
        action_type: 'logout',
        time: new Date()
      });


      const savedLog = await newLog.save()

      const toSend = {
        logut : savedLog,
        deny: denyToken
      }

      res.status(201).send(toSend);
    } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).send('An error occurred during logout');
    }
  });
  


  authenticationRoutes.get('/test', authorization.authenticateToken, authorization.authorizeRoles([ROLES.CUSTOMER]),(req, res) =>{
    res.send(req.user)
  })

  module.exports = authenticationRoutes