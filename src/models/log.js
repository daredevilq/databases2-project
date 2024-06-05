const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  user_id: {
    type: ObjectId,
    required: true
  },
  action_type: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    required: true,
  }
});

module.exports = mongoose.model('Logs', logSchema);
