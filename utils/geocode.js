// utils/geocode.js
const fetch = require('node-fetch');

async function geocodeLocation(location) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'CommunityHive/1.0'
    }
  });

  const data = await response.json();
  if (data && data.length > 0) {
    return {
      lat: data[0].lat,
      lon: data[0].lon
    };
  } else {
    throw new Error('Location not found');
  }
}

module.exports = geocodeLocation;
