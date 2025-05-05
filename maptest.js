// require("dotenv").config();
// const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

// const mapToken = process.env.MAP_TOKEN;
// console.log("Mapbox Token:", mapToken);

// const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// (async () => {
//   try {
//     const response = await geocodingClient
//       .forwardGeocode({
//         query: "Kathmandu, Nepal",
//         limit: 1,
//       })
//       .send();

//     console.log("Geocoding Success:", response.body.features[0]);
//   } catch (error) {
//     console.error("Mapbox Error:", error.message);
//   }
// })();

// require("dotenv").config();
// const mbxClient = require('@mapbox/mapbox-sdk');

// const MAP_TOKEN = process.env.MAP_TOKEN;
// console.log("Mapbox Token:", MAP_TOKEN);

// const baseClient = mbxClient({ accessToken: MAP_TOKEN });

// require("dotenv").config();
// const mbxClient = require('@mapbox/mapbox-sdk');

// const MAP_TOKEN = process.env.MAP_TOKEN;

// // This prints the token as a raw string so we can catch issues
// console.log("MAP_TOKEN (raw):", JSON.stringify(MAP_TOKEN));

// const baseClient = mbxClient({ accessToken: MAP_TOKEN });


