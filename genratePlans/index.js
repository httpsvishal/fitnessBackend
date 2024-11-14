// const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config(); // Load environment variables from .env file

console.log(process.env.GEMINI_APIKEY)
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_APIKEY,
// });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_APIKEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function generateHealthPlan(user) {
  console.log("hey");
  const prompt
    = `
Generate a personalized health plan in JSON format based on the following details:

* **User Information:**
  * Age: ${user.age}
  * Gender: ${user.gender}
  * Height: ${user.height} cm
  * Weight: ${user.weight} kg
  * Fitness Goal: ${user.fitnessGoal}
  * Activity Level: ${user.activityLevel}
  * Diet Preferences: ${user.dietaryPreferences}
  * Target Weight: ${user.targetWeight} kg
  * Timeline for Goals: ${user.timelineForGoals} months
  * Dietary Restrictions: ${user.dietaryRestrictions}
  * Health Conditions: ${user.healthConditions}
  * Previous Activity Data: ${user.activities}

The JSON response should include the following fields:

* **morning_routine:**
  * hydration: water intake recommendations
  * optional: Optional activities like yoga or meditation
  * stretching_and_breathing: Specific stretching and breathing exercises
* **meals:**
  * breakfast:
    * time: Time for breakfast
    * foods:
      * item: Detailed food item description
      * calories: Caloric content in string
      * macronutrients: object with Protein, carbohydrates, and fat in string 
      
  * mid_morning_snack: Similar structure to breakfast
  * lunch: Similar structure to breakfast
  * afternoon_snack: Similar structure to breakfast
  * dinner: Similar structure to breakfast
  * evening_snack: Similar structure to breakfast
* **exercise_plan:**
  * steps_goal: Daily step goal
  * workout_routine:
    * warm_up: Warm-up exercises
    * cardio:
      * activity: Cardio activity (e.g., running, swimming, cycling)
      * duration: Duration of cardio activity
    * strength_training:
      * exercise: Exercise name (e.g., squats, push-ups)
      * sets: Number of sets
      * reps: Number of repetitions
* **evening_routine:**
  * screen_time: Recommendations for limiting screen time
  * relaxation: Relaxation techniques (e.g., reading, meditation)
* **sleep:**
  * recommended_hours: Recommended hours of sleep
  * environment: Ideal sleep environment conditions
* **hydration:**
  * daily_target: Daily water intake goal
  * tip: Hydration tips
* **additional_tips:**
  * mindful_eating: Tips for mindful eating
  * stress_management: Stress management techniques
  * consistency: Importance of consistency in following the plan

Please ensure the JSON response is well-formatted and free of errors.
`;


  try {
    let response = await model.generateContent(prompt);
    response = response.response.text();

    // Split the response to extract JSON content
    let data = response.split("```json\n");

    // Assuming the JSON content is between the first and second delimiter
    if (data.length > 1) {
      let jsonData = data[1].split("```")[0];

      // Parse the JSON data
      console.log(jsonData);
      let extractedData = JSON.parse(jsonData);

      // Use the extractedData as needed
      console.log(extractedData);
      return extractedData;
    } else {
      console.error("No JSON content found in the response.");
      return null;
    }
  } catch (error) {
    console.error("Error processing the response:", error);
    // Retry mechanism
    for (let i = 0; i < 3; i++) {
      try {
        let retryResponse = await model.generateContent(prompt);
        retryResponse = retryResponse.response.text();

        // Validate the response format
        if (!retryResponse.includes("```json")) {
          throw new Error("Invalid response format");
        }

        // Split the response to extract JSON content
        let retryData = retryResponse.split("```json\n");

        if (retryData.length > 1) {
          let retryJsonData = retryData[1].split("```")[0];

          // Parse the JSON data
          let retryExtractedData = JSON.parse(retryJsonData);

          // Use the extractedData as needed
          console.log(retryExtractedData);
          return retryExtractedData;
        } else {
          console.error("No JSON content found in the response.");
          return null;
        }
      } catch (retryError) {
        con
        sole.error("Retry error processing the response:", retryError);
        return null;
      }

    }
  }
}

module.exports = generateHealthPlan;
