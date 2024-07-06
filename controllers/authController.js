const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Organisation } = require('../models');
const { v4: uuidv4 } = require('uuid');

exports.register = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  try {
    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return res.status(422).json({ errors: [{ field: 'input', message: 'Required fields missing' }] });
    }

    // Check for existing user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(422).json({ errors: [{ field: 'email', message: 'Email already exists' }] });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user and organisation
    const user = await User.create({
      userId: uuidv4(),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
    });

    const organisation = await Organisation.create({
      orgId: uuidv4(),
      name: `${firstName}'s Organisation`,
      description: '',
    });

    await user.addOrganisation(organisation);

    // Generate JWT
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Registration unsuccessful',
      statusCode: 400,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(422).json({ errors: [{ field: 'input', message: 'Required fields missing' }] });
    }

    // Check for user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        status: 'Bad request',
        message: 'Authentication failed',
        statusCode: 401,
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'Bad request',
        message: 'Authentication failed',
        statusCode: 401,
      });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Authentication failed',
      statusCode: 401,
    });
  }
};
