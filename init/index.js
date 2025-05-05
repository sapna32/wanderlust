

require("dotenv").config();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mongoUrl = process.env.MONGO_URL;

async function main() {
  await mongoose.connect(mongoUrl);
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});

    // Here, we simply return the data without geocoding.
    const updatedData = initData.data.map((obj) => {
      return {
        ...obj,
        owner: "66567b03fda820235197b582",  // Static owner ID
        geometry: null,  // Setting geometry as null as we are not using a geocoding API
      };
    });

    // Insert the data into the database
    await Listing.insertMany(updatedData);
    console.log("DB is initialized");
  } catch (error) {
    console.error("Error initializing DB:", error);
  }
};

// Connect to the database and run the initialization
main().then(() => {
  initDB();
});
