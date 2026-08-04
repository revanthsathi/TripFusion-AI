const axios = require("axios");

const OPENROUTE_BASE_URL = "https://api.openrouteservice.org";

const openRouteHeaders = {
    Authorization: process.env.OPENROUTE_API_KEY
};

// =======================
// Search Location
// =======================
const searchLocation = async (place) => {

    const response = await axios.get(
        `${OPENROUTE_BASE_URL}/geocode/search`,
        {
            headers: openRouteHeaders,
            params: {
                text: place,
                size: 1
            }
        }
    );

    if (!response.data.features.length) {
        throw new Error("Location not found.");
    }

    const result = response.data.features[0];

    return {
        name: result.properties.label,
        country: result.properties.country,
        latitude: result.geometry.coordinates[1],
        longitude: result.geometry.coordinates[0]
    };

};

// =======================
// Route
// =======================
const getRoute = async (start, end) => {

    const from = await searchLocation(start);
    const to = await searchLocation(end);

    const response = await axios.post(

        `${OPENROUTE_BASE_URL}/v2/directions/driving-car`,

        {
            coordinates: [
                [from.longitude, from.latitude],
                [to.longitude, to.latitude]
            ]
        },

        {
            headers: {
                Authorization: process.env.OPENROUTE_API_KEY,
                "Content-Type": "application/json"
            }
        }

    );

    const summary =
        response.data.routes[0].summary;

    return {

        from,

        to,

        distance:
            (summary.distance / 1000).toFixed(2) + " km",

        duration:
            (summary.duration / 60).toFixed(0) + " mins",

        geometry:
            response.data.routes[0].geometry

    };

};

// =======================
// Nearby Places (Geoapify)
// =======================
const getNearbyPlaces = async (
    place,
    type = "tourism"
) => {

    const location =
        await searchLocation(place);

    const response = await axios.get(

        "https://api.geoapify.com/v2/places",

        {

            params: {

                categories: type,

                filter: `circle:${location.longitude},${location.latitude},5000`,

                bias: `proximity:${location.longitude},${location.latitude}`,

                limit: 20,

                apiKey: process.env.GEOAPIFY_API_KEY

            }

        }

    );

    const places =
        response.data.features.map(item => ({

            name:
                item.properties.name || "Unknown",

            address:
                item.properties.formatted || "",

            category:
                item.properties.categories || [],

            latitude:
                item.properties.lat,

            longitude:
                item.properties.lon

        }));

    return {

        location,

        total: places.length,

        places

    };

};

module.exports = {

    searchLocation,

    getRoute,

    getNearbyPlaces

};