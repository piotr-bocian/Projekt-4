const loginController = require('../controllers/login');
const express = require('express');
const router = express.Router();

router.post('/', loginController.logging);


module.exports = router;