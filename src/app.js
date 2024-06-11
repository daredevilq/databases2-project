require('dotenv').config()
const mongodb = require('mongodb');
const express = require('express');
const User = require('./models/user');
const Product = require('./models/product');
const { default: mongoose } = require('mongoose');
const app = express();
const PORT = 8000;
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const ROLES = require('./roles_list')

//routes
const userRoutes = require("./user_routes");
const productRoutes = require("./product_routes");
const brandRoutes = require("./brand_routes");
const commentRoutes = require('./comment_routes');
const adminRoutes = require('./admin_reports_routes');
const authenticationRoutes = require('./authentication_routes')


app.use(express.urlencoded({ extended: true }));
app.use(express.json())

mongoose
  .connect(process.env.DATABASE_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
  })
  .then((result) => {
	console.log("Connected to MongoDB");
  })
  .catch((error) => {
	console.log(error);
  });


app.get('/', (request, response) =>{
	response.send("WELCOME TO OUR SHOP");
})


app.use("/", userRoutes);
app.use("/", productRoutes);
app.use("/", brandRoutes);
app.use("/", commentRoutes)
app.use("/", adminRoutes)
app.use("/", authenticationRoutes)


app.listen(PORT, ()=>{
	console.log(`Local server opened on http://localhost:${PORT}/`);
});