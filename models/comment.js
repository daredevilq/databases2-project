const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});

const commentsSchema = new mongoose.Schema({
  product_id: {
    type: String,
    required: true,
  },
  customer_id: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  comments: [commentSchema],
});

module.exports = mongoose.model("Comments", commentsSchema);
