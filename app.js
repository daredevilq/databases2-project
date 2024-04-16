const mongodb = require('mongodb');
const express = require('express');
const User = require('./models/user')
const { default: mongoose } = require('mongoose');
const dbName = 'Shop';
const app = express();
const PORT = 8000;
const dbURI = `mongodb+srv://piotrsmialek:haslo123@cluster0.wsew7st.mongodb.net/${dbName}?retryWrites=true&w=majority`;


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
    response.send("HELLO");
})

app.get('/users', (req, res) =>{
    User.find()
    .then((result) =>{
        res.send(result);
    })
    .catch((err) => {
        console.log(err);
    })
})

app.listen(PORT, ()=>{
    console.log(`Local server opened on http://localhost:${PORT}/`);
});