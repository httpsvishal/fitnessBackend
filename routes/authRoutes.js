const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js'); // Import User model
const authenticate = require('../middleware/authenticate'); // Import authenticate middleware
const generateHealthPlan = require('../genratePlans/index.js');

const authRouter = express.Router();

// Register Route
authRouter.post('/register', async (req, res) => {
    try {
        const {name, email, password, age, height, weight, gender, fitnessGoal, targetWeight, timelineForGoals, activityLevel, dietaryPreferences, dietaryRestrictions, healthConditions } = req.body;

        let userData = {
            name,
            email,
            password,
            age,
            height,
            weight,
            gender,
            fitnessGoal,
            targetWeight,
            timelineForGoals,
            activityLevel,
            dietaryPreferences,
            dietaryRestrictions,
            healthConditions
        }
        let healthPlan = await generateHealthPlan(userData);
        console.log(userData);
        console.log(healthPlan);
        const user = new User({
            email,
            password,
            age,
            height,
            weight,
            gender,
            fitnessGoal,
            targetWeight,
            timelineForGoals,
            activityLevel,
            dietaryPreferences,
            dietaryRestrictions,
            healthConditions,
            healthPlan
        });
        
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error });
    }
});

// Login Route
authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.json({ message: 'Login successful', token,user });
});

// Profile Route (Protected)
authRouter.get('/profile', authenticate, (req, res) => {
    res.json({ message: 'This is your profile', user: req.user });
});

// Logout Route
authRouter.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

module.exports = authRouter;
