const express = require('express');
const session = require('express-session');

const app = express();

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
}));

app.get('/', (req, res) => {
    const sessionData = req.session;
  
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Authenticate user
    if (isValidUser(username, password)) {
      req.session.isLoggedIn = true;
      req.session.username = username;
  
      res.redirect('/dashboard');
    } else {
      res.redirect('/login');
    }
});

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 } // session timeout of 60 seconds
  }));

  app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/login');
      }
    });
});

app.get('/dashboard', (req, res) => {
    const isLoggedIn = req.session.isLoggedIn;
    const username = req.session.username;
  
    if (isLoggedIn) {
      res.render('dashboard', { username });
    } else {
      res.redirect('/login');
    }
  });