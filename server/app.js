const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser'); // For parsing request bodies

const app = express();

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true })); // For URL-encoded bodies (e.g., form submissions)
app.use(bodyParser.json()); // For JSON bodies

// Session middleware
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 } // Session timeout of 60 seconds
}));

app.get('/', (req, res) => {
    const sessionData = req.session;
    res.send('Welcome to the Home page!'); // You can modify this to your needs
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Example function to validate user credentials (you should implement this)
    const isValidUser = (username, password) => {
        // Replace with actual authentication logic
        return username === 'test' && password === 'password';
    };

    // Authenticate user
    if (isValidUser(username, password)) {
        req.session.isLoggedIn = true;
        req.session.username = username;
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            res.status(500).send('Could not log out');
        } else {
            res.redirect('/login');
        }
    });
});

app.get('/dashboard', (req, res) => {
    const isLoggedIn = req.session.isLoggedIn;
    const username = req.session.username;

    if (isLoggedIn) {
        res.send(`Welcome to the Dashboard, ${username}!`); // You can replace this with a view renderer (e.g., res.render('dashboard'))
    } else {
        res.redirect('/login');
    }
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
