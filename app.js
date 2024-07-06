const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const orgRoutes = require('./routes/orgRoutes');

const app = express();

app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/api/organisations', orgRoutes);

module.exports = app;
