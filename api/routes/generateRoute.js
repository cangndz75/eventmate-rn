const express = require('express');
const {generateText} = require('../googleAI'); 
const router = express.Router();

router.post('/', async (req, res) => {
  const { eventName, location } = req.body; 

  if (!eventName || !location) {
    return res.status(400).json({ message: 'Event name and location are required' });
  }

  const prompt = `Generate a detailed description for the event: ${eventName} happening at ${location}.`;

  try {
    const response = await generateText(prompt);
    res.status(200).json({ response });
  } catch (error) {
    console.error('Error generating content:', error.message);
    res.status(500).json({ message: 'Failed to generate content' });
  }
});

module.exports = router;
