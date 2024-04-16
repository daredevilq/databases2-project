const mongoose = require('mongoose');



const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    street: {
      type: String,
      required: true,
    },
    suite: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    zipcode: {
      type: String,
      required: true,
    },
  },
  phone: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);