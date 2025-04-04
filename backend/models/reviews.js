const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  product: {
    type: String,
    required: true
  },
  review: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  number: {
    type: String,
    required: false
  }
}, { timestamps: true }); 


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
