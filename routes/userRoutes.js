const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Get all users with rankings
router.get('/users', UserController.getAllUsers);

// Add new user

router.post('/users', UserController.createUser);

// Claim points for a user
router.post('/claim-points', UserController.claimPoints);

// Get claim history
router.get('/history', UserController.claimHistory);

// Get user-specific history
router.get('/history/:userId', UserController.specificHistory);

module.exports = router;

