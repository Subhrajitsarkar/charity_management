// controllers/userController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Donation = require('../models/donationModel');
const Charity = require('../models/charityModel');

function generateAccessToken(id, name, role) {
    return jwt.sign({ userId: id, name, role }, process.env.JWT_TOKEN);
}

exports.signup = async (req, res) => {
    try {
        const { name, email, number, password, confirm } = req.body;
        if (!name || !email || !number || !password || !confirm) {
            throw new Error('All fields are required');
        }
        if (password !== confirm) {
            throw new Error('Password does not match');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, number, password: hashedPassword });
        return res.status(201).json({ message: 'Signup successfully 🎉' });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error('All fields are required');
        }
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error('Invalid email or password');
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid email or password');
        }
        const token = generateAccessToken(user.id, user.name, user.role);
        return res.status(200).json({
            message: 'Logged in successfully ✨',
            token: token
        });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

// await axios.get('http://localhost:3000/user/profile)'
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findByPk(userId);
        if (!user) throw new Error('User not found');
        return res.json({
            name: user.name,
            email: user.email,
            number: user.number,
            role: user.role
        });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

// await axios.put('http://localhost:3000/user/profile')
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId; //userId contains id, name, role
        const { name, email, number } = req.body;
        if (!name || !email || !number) {
            throw new Error('All fields are required');
        }
        const user = await User.findByPk(userId);//it returns single object.
        if (!user) throw new Error('User not found');
        user.name = name;
        user.email = email;
        user.number = number;
        await user.save();
        return res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};


// donationResponse
exports.getDonations = async (req, res) => {
    try {
        const userId = req.user.userId;
        const donations = await Donation.findAll({
            where: { userId },
            include: [{ model: Charity, attributes: ['name'] }]
        });

        // Format the data if needed
        const result = donations.map((donation) => ({
            // id: donation.id,
            amount: donation.amount,
            date: donation.date,
            paymentStatus: donation.paymentStatus,
            charityName: donation.charity ? donation.charity.name : 'N/A'
        }));

        return res.json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch donations' });
    }
};






//When you call Donation.findAll(...)Sequelize returns an array of donation records


//Including Associated Data (JOIN Operation):

// The include option tells Sequelize to perform a SQL JOIN to fetch related data from another table.
// In this case, it tells Sequelize to join the Charity model with each donation record.
// Association Setup:

// In your project, you've defined the association:
// Donation.belongsTo(Charity);
// Charity.hasMany(Donation);
// This tells Sequelize that each donation record is linked to one charity. Therefore, Sequelize knows how to join the donations and charities tables based on the foreign key (often charityId).
// Selecting Specific Attributes:

// attributes: ['name'] means that only the name field from the Charity table should be included.
// This is efficient because it avoids loading unnecessary data from the Charity table. Only the charity's name is needed to display on the donation history or other parts of the app.
