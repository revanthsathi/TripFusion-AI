const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest"
});

// =======================
// Generate AI Trip Itinerary
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
You are TripFusion AI, an expert travel planner.

Generate a complete travel itinerary.

Destination: ${destination}
Budget: ₹${budget}
Number of Days: ${numberOfDays}
Travelers: ${travelers}
Interests: ${interests}

IMPORTANT INSTRUCTIONS:

1. Return ONLY valid JSON.
2. Do NOT return markdown.
3. Do NOT wrap the response in \`\`\`json.
4. Do NOT write explanations.
5. Return exactly in the following structure.

{
  "destination": "",
  "budget": 0,
  "numberOfDays": 0,
  "travelers": 0,

  "days": [
    {
      "day": 1,
      "morning": "",
      "afternoon": "",
      "evening": ""
    }
  ],

  "budgetBreakdown": {
    "hotel": "",
    "food": "",
    "transport": "",
    "activities": "",
    "shopping": ""
  },

  "recommendedHotels": [
    {
      "name": "",
      "reason": ""
    }
  ],

  "recommendedRestaurants": [
    {
      "name": "",
      "speciality": ""
    }
  ],

  "packingTips": [
    ""
  ],

  "weatherAdvice": ""
}
`;

    const result = await model.generateContent(prompt);

    let response = result.response.text();

    // Remove markdown if Gemini returns it
    response = response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    try {

        return JSON.parse(response);

    } catch (error) {

        console.error("Gemini JSON Parse Error:", error);

        throw new Error(
            "Gemini returned an invalid JSON response."
        );

    }

};

module.exports = {
    generateTripItinerary
};