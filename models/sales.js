const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const salesSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref:'User',
    },
    course: {
      type: Schema.Types.ObjectId,
      ref:'Course',
    },
    amount: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Sales', salesSchema, 'sales');
