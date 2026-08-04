const axios = require("axios");

const BASE_URL = "https://api.openrouteservice.org";

const headers = {
    Authorization: process.env.OPENROUTE_API_KEY
};

// =======================
// Search Location
// =======================
const searchLocation = async (place) => {

    const response = await axios.get(
        `${BASE_URL}/geocode/search`,
        {
            headers,
            params: {
                text: place,
                size: 1
            }
        }
    );

    if (
        !response.data.features ||
        response.data.features.length === 0
    ) {
        throw new Error("Location not found.");
    }

    const result =
        response.data.features[0];

    return {

        name: result.properties.label,

        country:
            result.properties.country ||

            "",

        latitude:
            result.geometry.coordinates[1],

        longitude:
            result.geometry.coordinates[0]

    };

};

module.exports = {
    searchLocation
};