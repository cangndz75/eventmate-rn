// api/routes/generateRoute.js
const express = require('express');
const {generateText} = require('../googleAI'); // Import Google AI function
const router = express.Router();

router.post('/', async (req, res) => {
  const {eventName} = req.body; // Receive the event name from frontend

  if (!eventName) {
    return res.status(400).json({message: 'Event name is required'});
  }

  const prompt = `Generate a detailed description for the event: ${eventName}`;

  try {
    const response = await generateText(prompt);
    res.status(200).json({response});
  } catch (error) {
    console.error('Error generating content:', error.message);
    res.status(500).json({message: 'Failed to generate content'});
  }
});

module.exports = router;
