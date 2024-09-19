const Feedback = require('../models/Feedback');

exports.submitFeedback = async (req, res) => {
  const { rating, comments } = req.body;

  try {
    const feedback = new Feedback({ rating, comments });
    await feedback.save();
    res.status(200).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting feedback' });
  }
};
