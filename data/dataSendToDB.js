const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");
const Car = require("../models/carModels");
const User = require("../models/userModel");
const Review = require("../models/reviewModel");

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log("DB connection successful!"))
  .catch(err => console.log(err));

const cars = JSON.parse(fs.readFileSync(`${__dirname}/cars.json`), "utf-8");
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Car.create(cars);
    // await User.create(users)
    // await Review.create(reviews);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Car.deleteMany();
    // await User.deleteMany();
    // await Review.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  // console.log(new Date('10-10-2010'))
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

// console.log(car)

// const data = [
//     {
//         "brand": "BMW",
//         model: "X5",
//         description: "description1",
//         year: 2017,
//         price: 40000,
//         transmission: "manual", // "automatic"
//         driveType: "4WD", // 4WD, FWD, RWD - задний привод
//         fuelType: "Gasoline", // Gasoline,  Diesel, Electric, Gas, Hybrid,
//         features: ["aaa", "bbb", "ccc"],
//         cylinder: 6,
//         color: "black",
//         bodyStyle: "SUV", // Hatchback, Sedan, Coupe (Купе), Convertible(кабриолет),Pickup (большие джипы), SUV (Sport Utility Vehicle BMVX5)
//         imageCover: "tour-1-cover.jpg",
//         images: ["tour-1-1.jpg", "tour-1-2.jpg", "tour-1-3.jpg"]
//     },
//     {
//         "brand": "BMW",
//         model: "X6",
//         description: "description2",
//         year: 2019,
//         price: 50000,
//         transmission: "automatic", // "automatic"
//         driveType: "4WD", // 4WD, FWD, RWD - задний привод
//         fuelType: "Gasoline", // Gasoline,  Diesel, Electric, Gas, Hybrid,
//         features: ["aaa", "bbb", "ccc"],
//         cylinder: 6,
//         color: "black",
//         bodyStyle: "SUV", // Hatchback, Sedan, Coupe (Купе), Convertible(кабриолет),Pickup (большие джипы), SUV (Sport Utility Vehicle BMVX5)
//         imageCover: "tour-1-cover.jpg",
//         images: ["tour-1-1.jpg", "tour-1-2.jpg", "tour-1-3.jpg"]
//     },
//     {
//         "brand": "BMW",
//         model: "M6",
//         description: "description3",
//         year: 2017,
//         price: 65000,
//         transmission: "automatic", // "automatic"
//         driveType: "4WD", // 4WD, FWD, RWD - задний привод
//         fuelType: "Gasoline", // Gasoline,  Diesel, Electric, Gas, Hybrid,
//         features: ["aaa", "bbb", "ccc"],
//         cylinder: 8,
//         color: "white",
//         bodyStyle: "Coupe", // Hatchback, Sedan, Coupe (Купе), Convertible(кабриолет),Pickup (большие джипы), SUV (Sport Utility Vehicle BMVX5)
//         imageCover: "tour-1-cover.jpg",
//         images: ["tour-1-1.jpg", "tour-1-2.jpg", "tour-1-3.jpg"]
//     },
//     {
//         "brand": "Ford",
//         model: "Mustang",
//         description: "description4",
//         year: 2015,
//         price: 25000,
//         transmission: "manual", // "automatic"
//         driveType: "RWD", // 4WD, FWD, RWD - задний привод
//         fuelType: "Gasoline", // Gasoline,  Diesel, Electric, Gas, Hybrid,
//         features: ["aaa", "bbb", "ccc"],
//         cylinder: 8,
//         color: "black",
//         bodyStyle: "Coupe", // Hatchback, Sedan, Coupe (Купе), Convertible(кабриолет),Pickup (большие джипы), SUV (Sport Utility Vehicle BMVX5)
//         imageCover: "tour-1-cover.jpg",
//         images: ["tour-1-1.jpg", "tour-1-2.jpg", "tour-1-3.jpg"]
//     },
//     {
//         "brand": "Honda",
//         model: "Accord",
//         description: "description7",
//         year: 2016,
//         price: 27000,
//         transmission: "manual", // "automatic"
//         driveType: "FWD", // 4WD, FWD, RWD - задний привод
//         fuelType: "Gasoline", // Gasoline,  Diesel, Electric, Gas, Hybrid,
//         features: ["aaa", "bbb", "ccc"],
//         cylinder: 6,
//         color: "red",
//         bodyStyle: "Sedan", // Hatchback, Sedan, Coupe (Купе), Convertible(кабриолет),Pickup (большие джипы), SUV (Sport Utility Vehicle BMVX5)
//         imageCover: "tour-1-cover.jpg",
//         images: ["tour-1-1.jpg", "tour-1-2.jpg", "tour-1-3.jpg"]
//     },
//     {
//         "brand": "Volkswagen",
//         model: "Touareg",
//         description: "description8",
//         year: 2017,
//         price: 29000,
//         transmission: "automatic", // "automatic"
//         driveType: "4WD", // 4WD, FWD, RWD - задний привод
//         fuelType: "Diesel", // Gasoline,  Diesel, Electric, Gas, Hybrid,
//         features: ["aaa", "bbb", "ccc"],
//         cylinder: 6,
//         color: "black",
//         bodyStyle: "SUV", // Hatchback, Sedan, Coupe (Купе), Convertible(кабриолет),Pickup (большие джипы), SUV (Sport Utility Vehicle BMVX5)
//         imageCover: "tour-1-cover.jpg",
//         images: ["tour-1-1.jpg", "tour-1-2.jpg", "tour-1-3.jpg"]
//     },
//     {
//         "brand": "Kia",
//         model: "Soul",
//         description: "description8",
//         year: 2017,
//         price: 29000,
//         transmission: "automatic", // "automatic"
//         driveType: "4WD", // 4WD, FWD, RWD - задний привод
//         fuelType: "Electric", // Gasoline,  Diesel, Electric, Gas, Hybrid,
//         features: ["aaa", "bbb", "ccc"],
//         cylinder: 6,
//         color: "black",
//         bodyStyle: "Hatchback", // Hatchback, Sedan, Coupe (Купе), Convertible(кабриолет),Pickup (большие джипы), SUV (Sport Utility Vehicle BMVX5)
//         imageCover: "tour-1-cover.jpg",
//         images: ["tour-1-1.jpg", "tour-1-2.jpg", "tour-1-3.jpg"]
//     },
// ]

// const data = [
//     {
//         "brand": "BMW",
//         "model": "X5",
//         "description": "description1",
//         "year": 2017,
//         "price": 40000,
//         "transmission": "manual", // "automatic"
//         "driveType": "4WD", // 4WD, FWD, RWD - задний привод
//         "fuelType": "Gasoline", // Gasoline,  Diesel, Electric, Gas, Hybrid,
//         "features": ["aaa", "bbb", "ccc"],
//         "cylinder": 6,
//         "color": "black",
//         "bodyStyle": "SUV", // Hatchback, Sedan, Coupe (Купе), Convertible(кабриолет),Pickup (большие джипы), SUV (Sport Utility Vehicle BMVX5)
//         "imageCover": "tour-1-cover.jpg",
//         "images": ["tour-1-1.jpg", "tour-1-2.jpg", "tour-1-3.jpg"]
//     },
//     {
//         "brand": "BMW",
//         "model": "X6",
//         "description": "description2",
//         "year": 2019,
//         "price": 50000,
//         "transmission": "automatic", // "automatic"
//         "driveType": "4WD", // 4WD, FWD, RWD - задний привод
//         "fuelType": "Gasoline", // Gasoline,  Diesel, Electric, Gas, Hybrid,
//         "features": ["aaa", "bbb", "ccc"],
//         "cylinder": 6,
//         "color": "black",
//         "bodyStyle": "SUV", // Hatchback, Sedan, Coupe (Купе), Convertible(кабриолет),Pickup (большие джипы), SUV (Sport Utility Vehicle BMVX5)
//         "imageCover": "tour-1-cover.jpg",
//         "images": ["tour-1-1.jpg", "tour-1-2.jpg", "tour-1-3.jpg"]
//     },
//     {
//         "brand": "BMW",
//         "model": "M6",
//         "description": "description3",
//         "year": 2017,
//         "price": 65000,
//         "transmission": "automatic", // "automatic"
//         "driveType": "4WD", // 4WD, FWD, RWD - задний привод
//         "fuelType": "Gasoline", // Gasoline,  Diesel, Electric, Gas, Hybrid,
//         "features": ["aaa", "bbb", "ccc"],
//         "cylinder": 8,
//         "color": "white",
//         "bodyStyle": "Coupe", // Hatchback, Sedan, Coupe (Купе), Convertible(кабриолет),Pickup (большие джипы), SUV (Sport Utility Vehicle BMVX5)
//         "imageCover": "tour-1-cover.jpg",
//         "images": ["tour-1-1.jpg", "tour-1-2.jpg", "tour-1-3.jpg"]
//     },
//     {
//         "brand": "Ford",
//         "model": "Mustang",
//         "description": "description4",
//         "year": 2015,
//         "price": 25000,
//         "transmission": "manual", // "automatic"
//         "driveType": "RWD", // 4WD, FWD, RWD - задний привод
//         "fuelType": "Gasoline", // Gasoline,  Diesel, Electric, Gas, Hybrid,
//         "features": ["aaa", "bbb", "ccc"],
//         "cylinder": 8,
//         "color": "black",
//         "bodyStyle": "Coupe", // Hatchback, Sedan, Coupe (Купе), Convertible(кабриолет),Pickup (большие джипы), SUV (Sport Utility Vehicle BMVX5)
//         "imageCover": "tour-1-cover.jpg",
//         "images": ["tour-1-1.jpg", "tour-1-2.jpg", "tour-1-3.jpg"]
//     },
//     {
//         "brand": "Honda",
//         "model": "Accord",
//         "description": "description7",
//         "year": 2016,
//         "price": 27000,
//         "transmission": "manual", // "automatic"
//         "driveType": "FWD", // 4WD, FWD, RWD - задний привод
//         "fuelType": "Gasoline", // Gasoline,  Diesel, Electric, Gas, Hybrid,
//         "features": ["aaa", "bbb", "ccc"],
//         "cylinder": 6,
//         "color": "red",
//         "bodyStyle": "Sedan", // Hatchback, Sedan, Coupe (Купе), Convertible(кабриолет),Pickup (большие джипы), SUV (Sport Utility Vehicle BMVX5)
//         "imageCover": "tour-1-cover.jpg",
//         "images": ["tour-1-1.jpg", "tour-1-2.jpg", "tour-1-3.jpg"]
//     },
//     {
//         "brand": "Volkswagen",
//         "model": "Touareg",
//         "description": "description8",
//         "year": 2017,
//         "price": 29000,
//         "transmission": "automatic", // "automatic"
//         "driveType": "4WD", // 4WD, FWD, RWD - задний привод
//         "fuelType": "Diesel", // Gasoline,  Diesel, Electric, Gas, Hybrid,
//         "features": ["aaa", "bbb", "ccc"],
//         "cylinder": 6,
//         "color": "black",
//         "bodyStyle": "SUV", // Hatchback, Sedan, Coupe (Купе), Convertible(кабриолет),Pickup (большие джипы), SUV (Sport Utility Vehicle BMVX5)
//         "imageCover": "tour-1-cover.jpg",
//         "images": ["tour-1-1.jpg", "tour-1-2.jpg", "tour-1-3.jpg"]
//     },
//     {
//         "brand": "Kia",
//         "model": "Soul",
//         "description": "description8",
//         "year": 2017,
//         "price": 29000,
//         "transmission": "automatic", // "automatic"
//         "driveType": "4WD", // 4WD, FWD, RWD - задний привод
//         "fuelType": "Electric", // Gasoline,  Diesel, Electric, Gas, Hybrid,
//         "features": ["aaa", "bbb", "ccc"],
//         "cylinder": 6,
//         "color": "black",
//         "bodyStyle": "Hatchback", // Hatchback, Sedan, Coupe (Купе), Convertible(кабриолет),Pickup (большие джипы), SUV (Sport Utility Vehicle BMVX5)
//         "imageCover": "tour-1-cover.jpg",
//         "images": ["tour-1-1.jpg", "tour-1-2.jpg", "tour-1-3.jpg"]
//     },
// ]






// [
//   {
//       "_id": "5c88fa8cf4afda39709c2955",
//       "brand": "BMW",
//       "model": "X5",
//       "description": "description1",
//       "year": 2017,
//       "price": 40000,
//       "priceDiscount": 39000,
//       "transmission": "manual",
//       "driveType": "4WD",
//       "fuelType": "Gasoline",
//       "features": ["cruise-control", "turbo", "usb"],
//       "cylinder": 6,
//       "color": "black",
//       "bodyStyle": "SUV", 
//       "imageCover": "image-1-cover.jpg",
//       "images": ["image-1-1.jpg", "image-1-2.jpg", "image-1-3.jpg"],
//       "protectCar": false,
//       "ratingsAverage": 4.5,
//       "ratingsQuantity": 40,
//       "datesOfSale": ["2017-01-09T20:00:00.000Z", "2018-03-09T20:00:00.000Z", "2019-06-09T20:00:00.000Z"]
//   },
//   {
//       "_id": "5c88fa8cf4afda39709c2951",
//       "brand": "BMW",
//       "model": "X6",
//       "description": "description2",
//       "year": 2019,
//       "price": 50000,
//       "priceDiscount": 49000,
//       "transmission": "automatic",
//       "driveType": "4WD",
//       "fuelType": "Gasoline", 
//       "features": ["usb"],
//       "cylinder": 6,
//       "color": "black",
//       "bodyStyle": "SUV", 
//       "imageCover": "image-1-cover.jpg",
//       "images": ["image-1-1.jpg", "image-1-2.jpg", "image-1-3.jpg"],
//       "protectCar": false,
//       "ratingsAverage": 4.5,
//       "ratingsQuantity": 40,
//       "datesOfSale": ["2015-03-09T20:00:00.000Z", "2017-04-09T20:00:00.000Z", "2018-07-09T20:00:00.000Z"]
//   },
//   {
//       "_id": "5c88fa8cf4afda39709c295a",
//       "brand": "BMW",
//       "model": "M6",
//       "description": "description3",
//       "year": 2017,
//       "price": 65000,
//       "priceDiscount": 64000,
//       "transmission": "automatic",
//       "driveType": "4WD", 
//       "fuelType": "Gasoline",
//       "features": ["cruise-control", "camera", "bluetooth"],
//       "cylinder": 8,
//       "color": "white",
//       "bodyStyle": "Coupe",
//       "imageCover": "image-1-cover.jpg",
//       "images": ["image-1-1.jpg", "image-1-2.jpg", "image-1-3.jpg"],
//       "protectCar": false,
//       "ratingsAverage": 4.6,
//       "ratingsQuantity": 44,
//       "datesOfSale": ["2016-10-09T20:00:00.000Z", "2016-12-09T20:00:00.000Z", "2017-10-20T20:00:00.000Z"]
//   },
//   {
//       "_id": "5c88fa8cf4afda39709c2961",
//       "brand": "Ford",
//       "model": "Mustang",
//       "description": "description4",
//       "year": 2015,
//       "price": 25000,
//       "priceDiscount": 24000,
//       "transmission": "manual",
//       "driveType": "RWD",
//       "fuelType": "Gasoline",
//       "features": ["bluetooth", "navigation"],
//       "cylinder": 8,
//       "color": "black",
//       "bodyStyle": "Coupe",
//       "imageCover": "image-1-cover.jpg",
//       "images": ["image-1-1.jpg", "image-1-2.jpg", "image-1-3.jpg"],
//       "protectCar": false,
//       "ratingsAverage": 4.7,
//       "ratingsQuantity": 30,
//       "datesOfSale": ["2016-12-09T20:00:00.000Z", "2019-10-29T20:00:00.000Z"]
//   },
//   {
//       "_id": "5c88fa8cf4afda39709c295d",
//       "brand": "Honda",
//       "model": "Accord",
//       "description": "description7",
//       "year": 2016,
//       "price": 27000,
//       "priceDiscount": 26000,
//       "transmission": "manual",
//       "driveType": "FWD",
//       "fuelType": "Gasoline",
//       "features": ["remote-start", "navigation"],
//       "cylinder": 6,
//       "color": "red",
//       "bodyStyle": "Sedan",
//       "imageCover": "image-1-cover.jpg",
//       "images": ["image-1-1.jpg", "image-1-2.jpg", "image-1-3.jpg"],
//       "protectCar": false,
//       "ratingsAverage": 4.5,
//       "ratingsQuantity": 22,
//       "datesOfSale": ["2017-04-09T20:00:00.000Z", "2018-05-09T20:00:00.000Z", "2019-08-09T20:00:00.000Z"]
//   },
//   {
//       "_id": "5c88fa8cf4afda39709c2966",
//       "brand": "Volkswagen",
//       "model": "Touareg",
//       "description": "description8",
//       "year": 2017,
//       "price": 29000,
//       "priceDiscount": 28000,
//       "transmission": "automatic",
//       "driveType": "4WD",
//       "fuelType": "Diesel",
//       "features": ["navigation", "bluetooth", "usb"],
//       "cylinder": 6,
//       "color": "black",
//       "bodyStyle": "SUV",
//       "imageCover": "image-1-cover.jpg",
//       "images": ["image-1-1.jpg", "image-1-2.jpg", "image-1-3.jpg"],
//       "protectCar": false,
//       "ratingsAverage": 4.7,
//       "ratingsQuantity": 33,
//       "datesOfSale": ["2014-12-12T20:00:00.000Z"]
//   },
//   {
//       "_id": "5c88fa8cf4afda39709c2970",
//       "brand": "Kia",
//       "model": "Soul",
//       "description": "description8",
//       "year": 2017,
//       "price": 29000,
//       "priceDiscount": 28000,
//       "transmission": "automatic",
//       "driveType": "4WD",
//       "fuelType": "Electric",
//       "features": ["bluetooth", "usb", "audio"],
//       "cylinder": 6,
//       "color": "black",
//       "bodyStyle": "Hatchback",
//       "imageCover": "image-1-cover.jpg",
//       "images": ["image-1-1.jpg", "image-1-2.jpg", "image-1-3.jpg"],
//       "protectCar": true,
//       "ratingsAverage": 4.9,
//       "ratingsQuantity": 12
//   },
//   {
//       "_id": "5c88fa8cf4afda39709c2974",
//       "brand": "Lada",
//       "model": "Kalina",
//       "description": "description8",
//       "year": 2017,
//       "price": 7000,
//       "priceDiscount": 6800,
//       "transmission": "manual",
//       "driveType": "RWD",
//       "fuelType": "Gasoline",
//       "features": ["bluetooth", "usb", "audio"],
//       "cylinder": 6,
//       "color": "black",
//       "bodyStyle": "Hatchback",
//       "imageCover": "image-1-cover.jpg",
//       "images": ["image-1-1.jpg", "image-1-2.jpg", "image-1-3.jpg"],
//       "protectCar": true,
//       "ratingsAverage": 4.9,
//       "ratingsQuantity": 12
//   },
//   {
//       "_id": "5c88fa8cf4afda39709c296c",
//       "brand": "Lada",
//       "model": "Vesta",
//       "description": "description9",
//       "year": 2015,
//       "price": 6000,
//       "priceDiscount": 5800,
//       "transmission": "manual",
//       "driveType": "RWD",
//       "fuelType": "Gasoline",
//       "features": ["bluetooth", "usb", "audio"],
//       "cylinder": 6,
//       "color": "black",
//       "bodyStyle": "Hatchback",
//       "imageCover": "image-1-cover.jpg",
//       "images": ["image-1-1.jpg", "image-1-2.jpg", "image-1-3.jpg"],
//       "protectCar": true,
//       "ratingsAverage": 4.9,
//       "ratingsQuantity": 12
//   }
// ]