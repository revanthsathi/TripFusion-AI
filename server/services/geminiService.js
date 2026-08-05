const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest"
});

// =======================
// Generate AI Trip
// =======================
const generateTripItinerary = async (tripData) => {

    const {

        destination,

        budget,

        numberOfDays,

        travelers,

        interests,

        weather,

        nearbyPlaces,

        nearbyHotels,

        nearbyRestaurants

    } = tripData;

    const prompt = `
You are TripFusion AI.

You are an intelligent travel planner.

Generate a realistic travel itinerary.

==============================
TRIP DETAILS
==============================

Destination:
${destination}

Budget:
₹${budget}

Days:
${numberOfDays}

Travelers:
${travelers}

Interests:
${interests}

==============================
CURRENT WEATHER
==============================

Weather:
${weather.weather}

Description:
${weather.description}

Temperature:
${weather.temperature} °C

Humidity:
${weather.humidity} %

Wind Speed:
${weather.windSpeed} m/s

==============================
NEARBY TOURIST PLACES
==============================

${nearbyPlaces}

==============================
NEARBY HOTELS
==============================

${nearbyHotels}

==============================
NEARBY RESTAURANTS
==============================

${nearbyRestaurants}

==============================
IMPORTANT
==============================

If weather is rainy,

avoid beaches,

water sports,

boat rides,

trekking.

Recommend indoor activities.

If weather is sunny,

include beaches,

water sports,

forts,

walking tours.

Recommend nearby restaurants.

Recommend nearby hotels.

Distribute budget wisely.

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT return explanation.

JSON Structure:

{
"destination":"",
"budget":0,
"numberOfDays":0,
"travelers":0,

"days":[
{
"day":1,
"morning":"",
"afternoon":"",
"evening":"",
"estimatedCost":"",
"weather":"",
"recommendedTransport":""
}
],

"budgetBreakdown":{
"hotel":"",
"food":"",
"transport":"",
"activities":"",
"shopping":""
},

"recommendedHotels":[
{
"name":"",
"reason":""
}
],

"recommendedRestaurants":[
{
"name":"",
"speciality":""
}
],

"packingTips":[
""
],

"weatherAdvice":""
}
`;

    const result =
        await model.generateContent(prompt);

    let response =
        result.response.text();

    response = response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    try {

        return JSON.parse(response);

    }

    catch (error) {

        console.log(response);

        throw new Error(
            "Gemini returned invalid JSON."
        );

    }

};

module.exports = {

    generateTripItinerary

};