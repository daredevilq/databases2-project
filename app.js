const mongodb = require('mongodb');
const express = require('express');
const User = require('./models/user');
const Product = require('./models/product');
const { default: mongoose } = require('mongoose');
const dbName = 'Shop';
const app = express();
const PORT = 8000;
const dbURI = `mongodb+srv://piotrsmialek:haslo123@cluster0.wsew7st.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const userRoutes = require("./user_routes");
const productRoutes = require("./product_routes");
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

mongoose
  .connect(dbURI, {
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
app.listen(PORT, ()=>{
    console.log(`Local server opened on http://localhost:${PORT}/`);
});