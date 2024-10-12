const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// Initialize app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection URI
const uri = "mongodb://127.0.0.1:27017/portfolio_db"; // Adjust this if using MongoDB Atlas or remote

// Connect to MongoDB using Mongoose
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB via Mongoose'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Define a schema for the user profile with profile photo
const userProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  profilePhoto: {
    type: String, // Path to the uploaded profile photo
    required: false,
  },
}, {
  timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
});

// Create a model based on the schema
const UserProfile = mongoose.model('UserProfile', userProfileSchema);

// Set up storage engine for profile photo uploads using multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save files to the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Rename file with timestamp to avoid conflicts
  }
});

// Initialize multer middleware
const upload = multer({ storage });

// Route to upload profile photo
app.post('/upload-profile', upload.single('profilePhoto'), async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).send('Please fill out all required fields.');
  }

  // Check if profile photo was uploaded
  const profilePhoto = req.file ? req.file.path : null;

  try {
    // Check if a user profile already exists
    let userProfile = await UserProfile.findOne({ email });

    if (userProfile) {
      // Update existing profile
      userProfile.name = name;
      if (profilePhoto) userProfile.profilePhoto = profilePhoto;
    } else {
      // Create a new user profile with profile photo
      userProfile = new UserProfile({
        name,
        email,
        profilePhoto,
      });
    }

    // Save the document in the database
    await userProfile.save();

    res.status(200).send('Profile updated successfully!');
  } catch (error) {
    console.error('Error saving user profile:', error);
    res.status(500).send('Error updating your profile. Please try again later.');
  }
});

// Serve the uploaded profile photos statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
app.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});
