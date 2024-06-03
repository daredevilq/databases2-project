const mongoose = require('mongoose');


const socialMediaSchema = new mongoose.Schema({
  facebook: {
    type: String,
    required: false,
  },
  twitter: {
    type: String,
    required: false,
  },
  instagram:{
    type: String,
    required: false
  }
});

const contactSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

const locationSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
});

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: locationSchema,
    required: true,
  },
  contact: {
    type: contactSchema,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  established_year: {
    type: Number,
    required: true,
  },
  social_media: {
    type: socialMediaSchema,
    required: false,
  },
});

module.exports = mongoose.model("Brand", brandSchema);
