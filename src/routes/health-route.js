const express = require('express');
const healthCheck = require('../services/health-service');

const healthRoute = express.Router();

healthRoute.get('', healthCheck);

module.exports = healthRoute;
