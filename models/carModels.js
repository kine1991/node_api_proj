const mongoose = require('mongoose');
const slugify = require('slugify');

let carSchema = new mongoose.Schema({
    brand:  {
        type: String,
        required: [true, 'brand is require'],
        minlength: [2, 'brand should be equal 2 or more symbors'],
        maxlength: [50, 'brand should be equal 50 or less symbors'],
        trim: true,
        // unique: true
    },
    model: {
        type: String,
        required: [true, 'model is require'],
        trim: true,
        minlength: [2, 'model should be equal 2 or more symbors'],
        maxlength: [50, 'model should be equal 50 or less symbors'],
    },
    slug:{
        type: String,
        // required: true,
        // unique: true
    },
    description: {
        type: String,
        required: [true, 'description is require'],
        minlength: [10, 'description should be equal 10 or more symbors'],
        maxlength: [500, 'description should be equal 50 or less symbors'],
        trim: true
    },
    year: {
        type: Number,
        required: [true, 'year is require'], 
        min: [1900, 'year should be equal 1900 or more'],
        max: [2020, 'year should be equal 2020 or less'],
    },
    price: {
        type: Number,
        required: [true, 'price is require'], 
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function(val) {
              // this point only to current doc on NEW creator
              return val < this.price; // true - good  false - validation error  // val ~ {VALUE}
            },
            message: 'Discount Price {VALUE} should be bellow regular price'
          }
    },
    transmission: {
        type: String,
        required: [true, 'transmission is require'],
        enum: {
            values: ['manual', 'automatic'],
            message: 'Transmission is either: manual, automatic'
        }
    },
    driveType: {
        type: String,
        required: [true, 'drive type is require'], 
        enum: {
            values: ['4WD', 'FWD', 'RWD'],
            message: 'Drive type is either: 4WD, FWD, RWD'
        }
    },
    fuelType: {
        type: String,
        default: "gasoline", 
        enum: {
            values: ['gasoline', 'diesel', 'electric', 'gas', 'hybrid'],
            message: 'Fuel type is either: gasoline, diesel, electric, gas, hybrid'  
        }
    },
    cylinder: {
        type: Number,
        required: [true, 'Cylinder is require'], 
        min: [2, 'Cylinders should be equal 2 or more'],
        max: [10, 'Cylinders should be equal 10 or less'],
    },
    features: {
        type: [String],
    },
    color: {
        type: String,
        required: [true, 'color style is require'], 
    },
    bodyStyle: {
        type: String,
        required: [true, 'body style is require'], 
        enum: {
            values: ['hatchback', 'sedan', 'coupe', 'convertible', 'pickup', 'suv'],
            message: 'Body style is either: hatchback sedan, coupe, convertible, pickup, suv'  
        }
    }, // Hatchback, Sedan, Coupe (Купе), Convertible(кабриолет),Pickup (большие джипы), SUV (Sport Utility Vehicle BMVX5) 
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    ratingsAverage: {
        type: Number,
        default: 0,
        min: [0, 'Rating must be above 0'],
        max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    protectCar: {
        type: Boolean,
        default: false
    },
    datesOfSale: {
        type: [Date]
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// virtual property do not use in query
carSchema.virtual('priceInRubles').get(function(){
    return this.price * 60;
}); 

carSchema.pre('save', function(next){
    this.slug = slugify(this.brand+' '+this.model, { lower: true });
    next();
});

carSchema.pre(/^find/, function(next){
    this.find({protectCar: { $ne: true }});
    next();
});

// AGGREGATION MIDDLEWARE
carSchema.pre('aggregate', function(next) {
    // console.log(this.pipeline());
    this.pipeline().unshift({ $match: { protectCar: { $ne: true } } });
    next();
});

const Car = mongoose.model('Car', carSchema);
  
module.exports = Car;

// {
//     "brand": "BMV",
//     "model": "X5",
//     "description": "description1",
//     "year": 2017,
//     "price": 10000,
//     "transmission": "manual", // "automatic"
//     "driveType": "4WD", // 4WD, FWD, RWD - задний привод
//     "fuelType": "Diesel",  // Gasoline,  Diesel, Electric, Gas, Hybrid,
//     "features": ["aaa", "bbb", "ccc"],
//     "cylinder": "6",
//     "color": "black"
//     "bodyStyle": "Hatchback", // Hatchback, Sedan, Coupe (Купе), Convertible(кабриолет),Pickup (большие джипы), SUV (Sport Utility Vehicle BMVX5) 
//     "imageCover": "tour-1-cover.jpg",
//     "images": [
//          "tour-1-1.jpg",
//          "tour-1-2.jpg",
//          "tour-1-3.jpg"
//      ],
// }
