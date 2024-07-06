// File: routes/orgRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createOrganisation,
  getOrganisations,
  getOrganisationById,
  addUserToOrganisation
} = require('../controllers/orgController');

const router = express.Router();

router.post('/', protect, createOrganisation);
router.get('/', protect, getOrganisations);
router.get('/:orgId', protect, getOrganisationById);
router.post('/:orgId/users', protect, addUserToOrganisation);

module.exports = router;
