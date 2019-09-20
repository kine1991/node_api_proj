const mongoose = require('mongoose');
const slugify = require('slugify');

let carSchema = new mongoose.Schema({
    brand:  {
        type: String,
        required: [true, 'brand is require'],
        trim: true
    },
    model: {
        type: String,
        required: [true, 'model is require'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'description is require'],
        trim: true
    },
    year: {
        type: Number,
        required: [true, 'year is require'], 
    },
    price: {
        type: Number,
        required: [true, 'price is require'], 
    },
    transmission: {
        type: String,
        required: [true, 'transmission is require'], 
    },
    driveType: {
        type: String,
        required: [true, 'drive type is require'], 
    },
    fuelType: {
        type: String,
        default: "Gasoline", 
    },
    cylinder: {
        type: Number,
        required: [true, 'cylinder is require'], 
    },
    features: {
        type: [String],
    },
    cylinder: {
        type: Number,
        required: [true, 'cylinder is require'], 
    },
    color: {
        type: String,
        required: [true, 'color style is require'], 
    },
    bodyStyle: {
        type: String,
        required: [true, 'body style is require'], 
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    ratingsAverage: {
        type: Number,
        default: 0
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    protectCar: {
        type: Boolean,
        default: false
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
    return this.slug = slugify(this.name, { lower: true });
    next()
})

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
