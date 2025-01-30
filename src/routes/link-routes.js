const express = require('express');

const router = express.Router();
const linkController = require('../controllers/link-controller');
const authMiddleware = require('../middleware/auth-middleware');

router.use(authMiddleware);

router.get('/:token', linkController.accessVideoLink);

module.exports = router;
