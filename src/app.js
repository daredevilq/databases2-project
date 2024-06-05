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

//routes
const userRoutes = require("./user_routes");
const productRoutes = require("./product_routes");
const brandRoutes = require("./brand_routes");
const commentRoutes = require('./comment_routes');
const adminRoutes = require('./admin_reports_routes');

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


// zrobic logs dla logowań 
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

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

app.get('/test', authenticateToken, (req, res) =>{
  console.log("dasdassad")
  res.send(req.user)
})




app.use("/", userRoutes);
app.use("/", productRoutes);
app.use("/", brandRoutes);
app.use("/", commentRoutes)
app.use("/", adminRoutes)


app.listen(PORT, ()=>{
    console.log(`Local server opened on http://localhost:${PORT}/`);
});