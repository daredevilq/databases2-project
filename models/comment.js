const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userid: {
    type: ObjectId,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});

const commentsSchema = new mongoose.Schema({
  product_id: {
    type: ObjectId,
    required: true,
  },
  customer_id: {
    type: ObjectId,
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


