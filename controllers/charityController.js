// controllers/charityController.js
const Charity = require('../models/charityModel');

exports.registerCharity = async (req, res) => {
    try {
        const { name, mission, location, category } = req.body;
        if (!name) throw new Error('Name is required');
        const newCharity = await Charity.create({ name, mission, location, category });
        return res.status(201).json({ message: 'Charity registered', charity: newCharity });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

exports.getAllCharities = async (req, res) => {
    try {
        const charities = await Charity.findAll();
        return res.json(charities);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

exports.getCharity = async (req, res) => {
    try {
        const charityId = req.params.id;
        const charity = await Charity.findByPk(charityId);
        if (!charity) throw new Error('Charity not found');
        return res.json(charity);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

exports.updateCharity = async (req, res) => {
    try {
        const charityId = req.params.id;
        const { name, mission, location, category } = req.body;
        const charity = await Charity.findByPk(charityId);
        if (!charity) throw new Error('Charity not found');

        if (name)
            charity.name = name;
        if (mission)
            charity.mission = mission;
        if (location)
            charity.location = location;
        if (category)
            charity.category = category;

        await charity.save();
        return res.json({ message: 'Charity updated', charity });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

exports.approveCharity = async (req, res) => {
    try {
        const charityId = req.params.id;
        const charity = await Charity.findByPk(charityId);
        if (!charity) throw new Error('Charity not found');
        charity.isApproved = true;
        await charity.save();
        return res.json({ message: 'Charity approved', charity });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

exports.updateImpactReport = async (req, res) => {
    try {
        const charityId = req.params.id;
        const { impactReport } = req.body;
        if (!impactReport) throw new Error('Impact report content is required');

        const charity = await Charity.findByPk(charityId);
        if (!charity) throw new Error('Charity not found');

        charity.impactReport = impactReport;
        await charity.save();
        return res.json({ message: 'Impact report updated', charity });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

exports.getImpactReport = async (req, res) => {
    try {
        const charityId = req.params.id;
        const charity = await Charity.findByPk(charityId);
        if (!charity) throw new Error('Charity not found');
        return res.json({ impactReport: charity.impactReport });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

exports.deleteCharity = async (req, res) => {
    try {
        const charityId = req.params.id;
        const charity = await Charity.findByPk(charityId);
        if (!charity) throw new Error('Charity not found');
        await charity.destroy();
        return res.json({ message: 'Charity request rejected/deleted' });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};
