// controllers/adminController.js
const { Op } = require('sequelize');
const User = require('../models/userModel');
const Charity = require('../models/charityModel');

// Exclude the currently logged-in admin from the user list
exports.getAllUsers = async (req, res) => {
    try {
        const currentUserId = req.user.userId;
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            where: { id: { [Op.ne]: currentUserId } }
        });
        return res.json(users);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        await user.destroy();
        return res.json({ message: 'User deleted successfully' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Promote a user to admin
exports.makeAdmin = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        user.role = 'admin';
        await user.save();
        return res.json({ message: 'User updated to admin successfully', user });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Additional route for admin to see all charities
exports.getAllCharities = async (req, res) => {
    try {
        const charities = await Charity.findAll();
        return res.json(charities);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
