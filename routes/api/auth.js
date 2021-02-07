const express = require('express');
const router = express.Router();
const passport = require('../../config/passport');

const authController = require('../../controllers/api/authControllerAPI')

router.post('/authemticate', authController.authenticate);
router.post('/forgotPassword', authController.forgotPassword);

module.exports = router;