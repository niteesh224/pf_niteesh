const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize app
const app = express();
app.use(bodyParser.json());
app.use(cors());  // Enable CORS

// Route to handle questionnaire submissions
app.post('/questionnaire', (req, res) => {
  const { name, email, age, experience, comments } = req.body;

  if (!name || !email || !age || !experience) {
    return res.status(400).send('Please fill out all required fields.');
  }

  // Normally, you'd save the data to the database here

  console.log('Questionnaire data received:', req.body);
  res.status(200).send('Thank you for submitting the questionnaire!');
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
