const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  currency: {
    type: String,
    required: true,
  },
  payment_method: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
});

const basketSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  date_time: {
    type: Date,
    required: true,
  },
  products: [
    {
      type: String,
      required: true,
    },
  ],
  transaction: {
    type: transactionSchema,
    required: true,
  },
  delivery_status: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Basket", basketSchema);
