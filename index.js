const express = require('express');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const app = express();

// Path to the users.json file
const USERS_FILE = path.join(__dirname, 'users.json');

// Import task routes
const taskRoutes = require('./routes/task');

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Middleware for static files
app.use(express.static('public'));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Utility function to read and write to the users.json file
const readUsersFile = () => {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
  }
  const data = fs.readFileSync(USERS_FILE, 'utf-8');
  return JSON.parse(data);
};

const writeUsersFile = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

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

    // Read existing users
    const users = readUsersFile();

    // Check if the user already exists
    const existingUser = users.find((user) => user.name.toLowerCase() === name.toLowerCase());
    if (existingUser) {
      return res.status(400).send('User already exists. Please choose a different username.');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Add the new user to the JSON file
    const newUser = { name, password: hashedPassword };
    users.push(newUser);
    writeUsersFile(users);

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

    // Read existing users
    const users = readUsersFile();

    // Find the user by name
    const user = users.find((user) => user.name.toLowerCase() === name.toLowerCase());
    if (!user) {
      console.log('User not found');
      return res.status(404).send('User not found');
    }

    // Compare the hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch) {
      console.log(`User ${name} logged in successfully!`);
      return res.render('home', { username: name }); // Render the home page
    } else {
      console.log('Incorrect password');
      return res.status(401).send('Incorrect password');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal server error');
  }
});

// Use task routes
app.use(taskRoutes);

// Start the server
const port = 4100;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
