const express = require('express');
const { generateTicket } = require('../controllers/ticketController');
const router = express.Router();

router.post('/generate', generateTicket);

module.exports = router;
