const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./models/User'); // Ensure this path is correct


const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware for static files 
app.use(express.static('public'));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// MongoDB connection setup
mongoose.connect('mongodb://localhost:27017/taskmaster')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });


// Routes
app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

// User registration
app.post('/signup', async (req, res) => {
    try {
        const { name, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ name });
        if (existingUser) {
            return res.status(400).send('User already exists. Please choose a different username.');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save new user
        const newUser = new User({ name, password: hashedPassword });
        await newUser.save();

        console.log(`User ${name} registered successfully!`);

        // Render a success view
        res.render('success', {
            message: `Welcome ${name}, you have successfully registered on TaskMaster!`,
            redirectUrl: '/login',
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
    }
});

// User login
app.post('/login', async (req, res) => {
    try {
        const { name, password } = req.body;

        // Case-insensitive search for the username
        const user = await User.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (!user) {
            console.log('User not found');
            return res.status(404).send('User not found');
        }

        // Compare hash password from database with plain text
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
            console.log(`User ${name} logged in successfully!`);
            return res.render('home'); // Render the home page
        } else {
            console.log('Incorrect password');
            return res.status(401).send('Incorrect password');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal server error');
    }
});


// Start the server
const port = 4100;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});