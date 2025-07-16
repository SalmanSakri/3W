const User = require('../models/user');
const History = require("../models/pointHistory")

// Initialize default users
const initializeUsers = async () => {
    const defaultUsers = [
        'Rahul', 'Kamal', 'Sanak', 'Priya', 'Amit',
        'Sneha', 'Ravi', 'Pooja', 'Arjun', 'Meera'
    ];

    for (const userName of defaultUsers) {
        const existingUser = await User.findOne({ name: userName });
        if (!existingUser) {
            await User.create({ name: userName });
        }
    }

    await updateRankings();
};
initializeUsers();

// Update rankings for all users
const updateRankings = async () => {
    const users = await User.find().sort({ totalPoints: -1 });

    for (let i = 0; i < users.length; i++) {
        users[i].rank = i + 1;
        await users[i].save();
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ totalPoints: -1, name: 1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'User name is required' });
        }

        const existingUser = await User.findOne({ name: name.trim() });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const newUser = new User({ name: name.trim() });
        await newUser.save();
        await updateRankings();

        const users = await User.find().sort({ totalPoints: -1, name: 1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.claimPoints = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate random points between 1-10
        const pointsAwarded = Math.floor(Math.random() * 10) + 1;

        // Update user's total points
        user.totalPoints += pointsAwarded;
        await user.save();

        // Create history entry
        await History.create({
            userId: user._id,
            userName: user.name,
            pointsAwarded,
            totalPointsAfter: user.totalPoints
        });

        // Update rankings
        await updateRankings();

        // Return updated user list
        const users = await User.find().sort({ totalPoints: -1, name: 1 });

        res.json({
            message: 'Points claimed successfully',
            pointsAwarded,
            user: user.name,
            users
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.claimHistory = async (req, res) => {
    try {
        const history = await History.find()
            .sort({ claimedAt: -1 })
            .limit(50); // Limit to last 50 claims

        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.specificHistory = async (req, res) => {
    try {
        const feedback = await Feedback.find().populate('userId', 'username');
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
