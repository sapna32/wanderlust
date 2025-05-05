



// routes/booking.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require('../models/listing');
const Booking = require('../models/booking');

// GET: Render the booking form
router.get('/new/:listingId', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listingId);
    if (!listing) {
      return res.status(404).send('Listing not found');
    }
    res.render('bookings/booking', { listing });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

// POST: Handle booking form submission
router.post('/', async (req, res) => {
  const { listingId, checkIn, checkOut, guests, notes } = req.body;

  const checkInDate = new Date(checkIn);
  checkInDate.setHours(0, 0, 0, 0); // Set to midnight for accurate comparison

  const checkOutDate = new Date(checkOut);
  checkOutDate.setHours(0, 0, 0, 0); // Set to midnight for accurate comparison

  // Check if check-in is before check-out
  if (checkInDate >= checkOutDate) {
    req.flash('error', 'Check-out date must be after check-in date.');
    return res.redirect(`/bookings/new/${listingId}`);
  }

  try {
    // Create the booking
    const booking = new Booking({
      listing: listingId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      notes
    });

    // Save the booking to the database
    await booking.save();
    req.flash('success', 'Booking successfully created!');
    res.redirect(`/listings/${listingId}`); // Redirect to the listing page after success
  } catch (err) {
    console.log(err);
    req.flash('error', 'There was an error while processing your booking.');
    res.redirect(`/bookings/new/${listingId}`);
  }
});

module.exports = router;