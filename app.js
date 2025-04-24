// app.js
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const sequelize = require('./utils/database');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Import Models & Define Associations
const User = require('./models/userModel');
const Charity = require('./models/charityModel');
const Donation = require('./models/donationModel');

User.hasMany(Donation);
Donation.belongsTo(User);
Charity.hasMany(Donation);
Donation.belongsTo(Charity);

// Import Routes
const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);

const charityRoutes = require('./routes/charityRoutes');
app.use('/charities', charityRoutes);

const donationRoutes = require('./routes/donationRoutes');
app.use('/donations', donationRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'signup.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'login.html'));
});
app.get('/charity', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'charity.html'));
});
app.get('/charity-manage', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'charityManage.html'));
});
app.get('/donation', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'donation.html'));
});
app.get('/donation-history', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'donationHistory.html'));
});
app.get('/admin-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'admin.html'));
});

sequelize.sync()
    .then(() => {
        app.listen(4000, () => console.log('Server running on port 4000'));
    })
    .catch(err => console.error('Database sync failed:', err));

module.exports = app;
