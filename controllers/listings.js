

const dotenv = require("dotenv").config();
const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  try {
    let allListings = await Listing.find();
    res.render("./listings/index.ejs", { allListings });
  } catch (error) {
    req.flash("error", "Error loading listings.");
    res.redirect("/listings");
  }
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  } catch (error) {
    req.flash("error", "Error loading the listing.");
    res.redirect("/listings");
  }
};

module.exports.createListing = async (req, res, next) => {
  try {
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { filename, url };
    
    // No geocoding client used here
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
  } catch (error) {
    req.flash("error", "Error creating listing.");
    res.redirect("/listings");
  }
};

module.exports.renderEditForm = async (req, res) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    let imageUrl = listing.image.url.replace("/upload", "/upload/w_250,h_160");
    res.render("listings/edit.ejs", { listing, imageUrl });
  } catch (error) {
    req.flash("error", "Error loading the listing for editing.");
    res.redirect("/listings");
  }
};

module.exports.updateListing = async (req, res, next) => {
  try {
    let { id } = req.params;

    let updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (req.file) {
      let url = req.file.path;
      let filename = req.file.filename;
      updatedListing.image = { url, filename };
      await updatedListing.save();
    }

    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
  } catch (error) {
    req.flash("error", "Error updating listing.");
    res.redirect(`/listings/${id}`);
  }
};

module.exports.filter = async (req, res, next) => {
  try {
    let { id } = req.params;
    let allListings = await Listing.find({ category: { $all: [id] } });
    if (allListings.length !== 0) {
      res.locals.success = `Listings filtered by ${id}!`;
      res.render("listings/index.ejs", { allListings });
    } else {
      req.flash("error", `No listings found for ${id}!`);
      res.redirect("/listings");
    }
  } catch (error) {
    req.flash("error", "Error filtering listings.");
    res.redirect("/listings");
  }
};

module.exports.search = async (req, res) => {
  try {
    let input = req.query.q.trim().replace(/\s+/g, " ");
    if (!input) {
      req.flash("error", "Please enter a search query!");
      return res.redirect("/listings");
    }

    let element = input.split("").map((char, idx) => idx === 0 || input[idx - 1] === " " ? char.toUpperCase() : char.toLowerCase()).join("");

    let allListings = await Listing.find({
      $or: [
        { title: { $regex: element, $options: "i" } },
        { category: { $regex: element, $options: "i" } },
        { country: { $regex: element, $options: "i" } },
        { location: { $regex: element, $options: "i" } }
      ]
    }).sort({ _id: -1 });

    if (allListings.length !== 0) {
      res.locals.success = `Listings found for "${element}"!`;
      return res.render("listings/index.ejs", { allListings });
    }

    req.flash("error", "No listings found based on your search!");
    res.redirect("/listings");

  } catch (error) {
    req.flash("error", "Error during search.");
    res.redirect("/listings");
  }
};

module.exports.destroyListing = async (req, res) => {
  try {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
  } catch (error) {
    req.flash("error", "Error deleting listing.");
    res.redirect("/listings");
  }
};

module.exports.reserveListing = async (req, res) => {
  try {
    let { id } = req.params;
    req.flash("success", "Reservation details sent to your email!");
    res.redirect(`/listings/${id}`);
  } catch (error) {
    req.flash("error", "Error reserving listing.");
    res.redirect(`/listings/${id}`);
  }
};

