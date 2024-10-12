const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');  // Add this line


// Initialize app
const app = express();
app.use(bodyParser.json());
app.use(cors());  // Enable CORS


// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
}).then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));


// Create a user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Create a user model
const User = mongoose.model('User', userSchema);

// Route to handle user registration
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Check if the user already exists
  const userExists = await User.findOne({ username });
  if (userExists) {
    return res.status(400).send('User already exists');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const newUser = new User({
    username,
    password: hashedPassword,
  });

  // Save the user in the database
  await newUser.save();
  res.status(201).send('User registered successfully');
});

// Start the server
app.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});
