const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const healthPlanSchema = require('../models/healthPlan');

// activity Schema
const activitySchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    steps: { type: Number, required: true },
    workout_duration: { type: Number }, // in minutes
    calories_burned: { type: Number },
    calories_intake: { type: Number },
    hydration: { type: Number }, // in liters
    sleep_hours: { type: Number },
    weight: { type: Number },
    notes: { type: String }
});

// user schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6, // Ensure password is secure enough
    },
    age: {
        type: Number,
        required: true,
    },
    height: {
        type: String, // Height can be entered as a string (e.g., "180 cm" or "5'9\"")
        required: true,
    },
    weight: {
        type: String, // Weight can be in "kg" or "pounds"
        required: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true,
    },
    fitnessGoal: {
        type: String,
        enum: ['weight loss', 'muscle gain', 'toning', 'general fitness'],
        required: true,
    },
    targetWeight: {
        type: Number, // Optional target weight
    },
    timelineForGoals: {
        type: String, // Timeline in text format, e.g., "3 months", "6 weeks"
    },
    activityLevel: {
        type: String,
        enum: [
            'Sedentary',
            'Lightly Active',
            'Moderately Active',
            'Very Active',
            'Super Active',
        ],
        required: true,
    },
    dietaryPreferences: {
        type: String,
        enum: ['Vegetarian', 'Vegan', 'Non-Vegetarian', 'Pescatarian', 'Keto', 'Paleo', 'Other'],
        required: true
    },
    dietaryRestrictions: {
        type: String,
        enum: ['Gluten-Free', 'Lactose-Free', 'Nut-Free', 'Soy-Free', 'Halal', 'Kosher', 'None', 'Other'],
    },
    healthConditions: {
        type: String,
        enum: ['Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Arthritis', 'None', 'Other'],
    },
    activities: [activitySchema], // Array to track daily activity data
    healthPlan : healthPlanSchema
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

// Hash the password before saving the user document
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Add a method to validate password
userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Export the user model
const User = mongoose.model('User', userSchema);
module.exports = User;
