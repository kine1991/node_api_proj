const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");
const Car = require("../models/carModels");

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

const cars = JSON.parse(fs.readFileSync(`${__dirname}/data.json`), "utf-8");

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Car.create(cars);
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
