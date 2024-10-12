const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Contact form submission route
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send('Please fill out all required fields.');
  }

  // Here, you would normally send the email or store the data
  console.log(`Contact message from ${name} (${email}): ${message}`);

  res.status(200).send('Thank you for your message!');
});

// Start the server
app.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});
