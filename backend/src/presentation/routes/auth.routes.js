const express = require('express');
const { authMiddleware } = require('../middlewares/auth');
const { validateRegister, validateLogin } = require('../middlewares/validation');

const router = express.Router();

module.exports = (controller) => {
  router.post('/register', validateRegister, (req, res) => controller.register(req, res));
  router.post('/login', validateLogin, (req, res) => controller.login(req, res));
  router.put('/become-seller/:userId', authMiddleware, (req, res) => controller.becomeSeller(req, res));
  
  return router;
};
