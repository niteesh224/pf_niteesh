const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// MongoDB connection URI from environment variable
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mydb'; // Local fallback for testing

// Connect to MongoDB
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// Define Mongoose schema and model
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true }
});

const Contact = mongoose.model('Contact', contactSchema);

// Route to handle POST requests to /contacts
app.post('/contacts', async (req, res) => {
    const { name, email, message } = req.body;

    // Create a new contact document
    const newContact = new Contact({ name, email, message });

    try {
        // Save the contact to the database
        await newContact.save();
        res.status(201).send('Contact saved successfully');
    } catch (error) {
        res.status(500).send('Error saving contact: ' + error.message);
    }
});

// Route to get all contacts
app.get('/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (error) {
        res.status(500).send('Error fetching contacts: ' + error.message);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
