const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Import routes
const chatbotRoutes = require('./routes/chatbotRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

app.use('/api/chatbot', chatbotRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/tickets', ticketRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
