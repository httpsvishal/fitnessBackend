const express = require('express');
const trackRouter = express.Router();
const User = require('../models/User'); // Assuming you've created the User model

// Endpoint to track daily activities
trackRouter.post('/', async (req, res) => {
  const { email, steps, workout_duration, calories_burned, calories_intake, hydration, sleep_hours, weight, notes } = req.body;

  try {
    // Find the user by ID
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new activity entry for the day
    const newActivity = {
      steps,
      workout_duration,
      calories_burned,
      calories_intake,
      hydration,
      sleep_hours,
      weight,
      notes
    };

    // Push the activity to the user's activities array
    user.activities.push(newActivity);
    console.log("hey");
    await user.save();

    res.status(200).json({ message: 'Activity updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error tracking activity', error });
  }
});

module.exports = trackRouter;
