const express = require('express');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

module.exports = (controller) => {
  router.get('/seller/:userId', authMiddleware, (req, res) => controller.getSellerStats(req, res));
  
  return router;
};