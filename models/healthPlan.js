const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define macros for foods as a sub-schema
const macronutrientsSchema = new Schema({
  protein: { type: String },
  carbs: { type: String},
  fat: { type: String},
});

// Define food items schema
const foodItemSchema = new Schema({
  item: { type: String},
  calories: { type: Number},
  macronutrients: { type: macronutrientsSchema, required: true },
  carbs:{type:String, required:false}
});

// Define the routine for different meals/snacks
const mealSchema = new Schema({
  time: { type: String, },
  foods: [foodItemSchema],  // Array of food items
});

// Define workout routine schema
const strengthTrainingSchema = new Schema({
  exercise: { type: String, required: true },
  sets: { type: String, required: true },
  reps: { type: String, required: true },
});

const cardioSchema = new Schema({
  activity: { type: String, required: true },
  duration: { type: String, required: true },
});

const workoutRoutineSchema = new Schema({
  warm_up: { type: String, required: true },
  cardio: cardioSchema,
  strength_training: [strengthTrainingSchema],
});

// Define the main health plan schema
const healthPlanSchema = new Schema({
  morning_routine: {
    hydration: { type: String, required: true },
    optional: { type: String, required: true },
    stretching_and_breathing: { type: String, required: true },
  },
  meals: {
    breakfast: mealSchema,
    mid_morning_snack: mealSchema,
    lunch: mealSchema,
    afternoon_snack: mealSchema,
    dinner: mealSchema,
    evening_snack: mealSchema,
  },
  exercise_plan: {
    steps_goal: { type: String, required: true },
    workout_routine: workoutRoutineSchema,
  },
  evening_routine: {
    screen_time: { type: String, required: true },
    relaxation: { type: String, required: true },
  },
  sleep: {
    recommended_hours: { type: String, required: true },
    environment: { type: String, required: true },
  },
  hydration: {
    daily_target: { type: String, required: true },
    tip: { type: String, required: true },
  },
  additional_tips: {
    mindful_eating: { type: String, required: true },
    stress_management: { type: String, required: true },
    consistency: { type: String, required: true },
  },
});

// // Create and export the HealthPlan model
// const HealthPlan = mongoose.model("HealthPlan", healthPlanSchema);
module.exports = healthPlanSchema;
