const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review can not be empty!']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    car: {
        type: mongoose.Schema.ObjectId,
        ref: 'Car',
        required: [true, 'Review must belong to a car.']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user']
    }
});

reviewSchema.pre(/^find/, function(next) {
      this
      .populate({
        path: 'user',
        select: 'id'
      });
    //   .populate({
    //     path: 'car',
    //     select: '-sellers -usersLiked model brand'
    //   })
      next();
});





const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

