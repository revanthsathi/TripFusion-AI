const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest"
});

// =======================
// Generate Trip Itinerary
// =======================
const generateTripItinerary = async (tripData) => {

    const {
        destination,
        budget,
        numberOfDays,
        travelers,
        interests
    } = tripData;

    const prompt = `
You are an expert travel planner.

Generate a detailed travel itinerary.

Destination: ${destination}
Budget: ${budget}
Number of Days: ${numberOfDays}
Travelers: ${travelers}
Interests: ${interests}

Return the response using the following format:

Day 1:
Morning:
Afternoon:
Evening:

Day 2:
Morning:
Afternoon:
Evening:

Budget Breakdown

Recommended Hotels

Recommended Restaurants

Packing Tips

Weather Advice
`;

    const result = await model.generateContent(prompt);

    return result.response.text();

};

module.exports = {
    generateTripItinerary
};