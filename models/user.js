const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const userSchema = new Schema(
  {
    firstname: String,
    lastname: String,
    pictureUrl: String,
    email: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema, 'Users');
