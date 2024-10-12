const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

// Initialize app
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection URI
const uri = "mongodb+srv://niteeshkumar224:MtHvyEQ9t8w4WBXhKTWC@cluster0.qdy7z.mongodb.net/"
//const uri = "mongodb://127.0.0.1:27017/portfolio_db"; // Adjust this if using a remote MongoDB instance

// Connect to MongoDB using Mongoose
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB via Mongoose'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Define a schema for the contact form
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
}, {
  timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
});

// Create a model based on the schema
const Contact = mongoose.model('Contact', contactSchema);

// Contact form submission route
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send('Please fill out all required fields.');
  }

  try {
    // Create a new contact document
    const newContact = new Contact({ name, email, message });

    // Save the document in the database
    await newContact.save();

    res.status(200).send('Thank you for your message! Your data has been stored.');
  } catch (error) {
    console.error('Error saving contact form data:', error);
    res.status(500).send('Error submitting your message. Please try again later.');
  }
});

// Start the server
app.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});
