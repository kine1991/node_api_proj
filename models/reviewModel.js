const mongoose = require('mongoose');
const Car = require('./carModels');

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


reviewSchema.statics.calcAverageRatings = async function(carId){
    const stats = await this.aggregate([
        {
            $match: {car: carId}
        },
        {
            $group: {
                _id: '$car',
                nRating: {$sum: 1},
                avgRating: {$avg: '$rating'}
            }
        }
    ]);
    console.log(stats);

    if (stats.length > 0) {
        await Car.findByIdAndUpdate(carId, {
          ratingsQuantity: stats[0].nRating,
          ratingsAverage: stats[0].avgRating
        });
    } else {
        await Car.findByIdAndUpdate(carId, {
          ratingsQuantity: 0,
          ratingsAverage: 4.5
        });
    }
};

reviewSchema.post('save', function(){
    // Review.calcAverageRatings(this.car)
    this.constructor.calcAverageRatings(this.car);
});

// Обновление рейтинга при  обновлении и удалении отзыва // findByIdAndDelete // findByIdAndUpdate
reviewSchema.pre(/^findOneAnd/, async function(next) {
    this.r = await this.findOne();
    // console.log(this.r);
    next();
});

reviewSchema.post(/^findOneAnd/, async function() {
    // await this.findOne(); does NOT work here, query has already executed
    await this.r.constructor.calcAverageRatings(this.r.car);
});


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

