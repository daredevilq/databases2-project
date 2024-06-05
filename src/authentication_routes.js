require('dotenv').config()
const mongodb = require('mongodb');
const express = require('express');
const User = require('./models/user');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const ROLES = require('./roles_list')
const authenticationRoutes = express.Router();




//zrobic logs 
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
  
      res.status(201).json({ accessToken: accessToken });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).send('An error occurred during login');
    }
  });
  



authenticationRoutes.get('/logout',authenticateToken, async (req, res) => {
    try {
    console.log(req.user.user)
      jwt.sign(
        { user : req.user.user },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '2s' }
      );
      
      res.status(201).json(`${req.user.user.firstname}'s logout was successful`);
    } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).send('An error occurred during logout');
    }
  });
  

  
  function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    // we split because its: BEARER <token>
    const token = authHeader && authHeader.split(' ')[1]
  
    if(token == null){
        res.status(400)
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
      if(err) return res.sendStatus(403)
  
      req.user = user;
      next()
    })
  }
  
  function authorizeRoles(allowedRoles) {
    return (req, res, next) => {
      if (!allowedRoles.includes(req.user.user.role)) {
        return res.status(403).send('Access forbidden: insufficient rights');
      }
      next();
    }
  }
  
  authenticationRoutes.get('/test', authenticateToken, authorizeRoles([ROLES.CUSTOMER]),(req, res) =>{
    res.send(req.user)
  })

  module.exports = authenticationRoutes