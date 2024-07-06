// File: controllers/orgController.js
const { Organisation, UserOrganisation, User } = require('../models');

const createOrganisation = async (req, res) => {
  try {
    const { name, description } = req.body;
    const organisation = await Organisation.create({
      name,
      description,
      // You can add more logic here if necessary
    });
    res.status(201).json({
      status: 'success',
      message: 'Organisation created successfully',
      data: organisation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrganisations = async (req, res) => {
  try {
    const organisations = await Organisation.findAll();
    res.status(200).json({
      status: 'success',
      data: { organisations }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrganisationById = async (req, res) => {
  try {
    const { orgId } = req.params;
    const organisation = await Organisation.findByPk(orgId);
    if (!organisation) {
      return res.status(404).json({ message: 'Organisation not found' });
    }
    res.status(200).json({
      status: 'success',
      data: organisation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addUserToOrganisation = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { userId } = req.body;
    const organisation = await Organisation.findByPk(orgId);
    const user = await User.findByPk(userId);

    if (!organisation || !user) {
      return res.status(404).json({ message: 'Organisation or User not found' });
    }

    await UserOrganisation.create({ orgId, userId });

    res.status(200).json({
      status: 'success',
      message: 'User added to organisation successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrganisation,
  getOrganisations,
  getOrganisationById,
  addUserToOrganisation
};
