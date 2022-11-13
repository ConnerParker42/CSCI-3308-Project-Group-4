const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const axios = require('axios');

// database configuration
const dbConfig = {
    host: 'db',
    port: 5432,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  };
  
  const db = pgp(dbConfig);
  
  // test your database
  db.connect()
    .then(obj => {
      console.log('Database connection successful'); // you can view this message in the docker compose logs
      obj.done(); // success, release the connection;
    })
    .catch(error => {
      console.log('ERROR:', error.message || error);
    });

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
    })
);
  
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
);

app.get('/', (request, response) => {
    response.redirect('/login');
});

app.get('/register', (request, response) => {
    response.render('pages/register.ejs');
});

app.post('/register', async (request, response) => {

    // Check if username is empty
    if( request.body.username == "") {
        // If so, render register w/ error message
        response.render('pages/register.ejs',
            { error: true, message: "Username cannot be empty"});
        return;
    };

    // Check if email is empty
    if( request.body.email == "") {
        // If so, render register w/ error message
        response.render('pages/register.ejs',
            { error: true, message: "Email Address cannot be empty"});
        return;
    };

    // Check if password is empty
    if( request.body.password == "") {
        // If so, render register w/ error message
        response.render('pages/register.ejs',
            { error: true, message: "Password cannot be empty"});
        return;
    };

    // Check if username is taken
    await db.none('SELECT * FROM USERS WHERE username = $1', [
        request.body.username
    ])
    // Username not taken, attempt to add user to database
    .then( async function(data) {
        // Hash password
        const hash = await bcrypt.hash(request.body.password, 10);
        const query = 'insert into users (username, email, password) values ($1, $2, $3);' 
        // Pass query to database in order to add use info to users table
         await db.any(query, [
            request.body.username,
            request.body.email,
            hash
        ])
        // Registration successful, redirect to /login
        .then(function(data){
            response.redirect('/login')
        })
        // Other error, render page w/ error message from database
        .catch(function (err) {
            response.render('pages/register',
            { error: true, message: err});
        });
    })
    // Username is taken, rerender page w/ error message
    .catch(function (err) {
        response.render('pages/register.ejs',
            {error: true, message: 'Username is already in use'}
        );
    });
});

app.get('/login', (request, response) => {
    response.render('pages/login.ejs');
});

app.post('/login', (request, response) => {
    const query = "select * from users where username=$1;";
    db.one(query, [
        request.body.username
    ])
    .then(async function(data){
        const match = await bcrypt.compare(request.body.password, data.password);
        if (!match){
            response.render('pages/login.ejs',
                { error: true, message: "Incorrect username or password." });
        }
        else {
            request.session.user = {
                api_key: process.env.API_KEY,
                username: request.body.username
            };
            request.session.save();
            response.redirect('/home');
        }
    })
    .catch(function (err) {
        response.render('pages/login.ejs',
            { error: true, message: "Incorrect username or password." });
    });
});

// Authentication Middleware.
const auth = (req, res, next) => {
    if (!req.session.user) {
      // Default to register page.
      return res.redirect('/register');
    }
    next();
  };
  
app.use(auth);

// Login variable middleware
app.use((req, res, next) => {
    // Boolean whether session exists
    res.locals.loggedin = !!req.session.user;
    next();
});

//Request should have the user name of the user who is logging in.
//Response has usernames of people the user has sent a message to.
app.get("/home", async (request, response) => {
    try {
        var contacts = await db.any("SELECT recipient_username FROM contacts where sender_username = $1;", [
            request.session.user.username
        ]);

        var messages = await db.any("SELECT * FROM messages WHERE receiver_username = $1 FETCH FIRST 3 ROWS ONLY;", [
            request.session.user.username
        ]);

        response.render('pages/home.ejs', { contacts: contacts, chat: messages });
    } catch (err) {
        response.render('pages/home.ejs',
            { error: true, message: "Error when getting home data.",
               contacts: [], chat: [] });
    }
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.render("pages/login", {
        message: 'Successfully logged out'
    });
});

app.get("/message/:username", (request, response) =>{
    const otherUsername = parseInt(request.params.username);
    const query = "select * from messages where (sender_username = $1 and receiver_username = $2) or (sender_username = $2 and receiver_username = $1);";
    db.any(query, [
        request.session.user.username,
        otherUsername
    ]).then(function(data){
        response.render('pages/message.ejs', { username: otherUsername ,chat: data });

    }).catch(function (err) {
        response.render('pages/home.ejs',
            { error: true, message: "Error when getting home data.", chat: [] });
    });
});

app.post("/message/:username", (request, response) =>{
    const otherUsername = parseInt(request.params.username);
    const query = "insert into messages (message, sender_username, receiver_username) values ($1, $2, $3);";
    db.any(query, [
        request.body.message,
        request.session.user.username,
        otherUsername
    ]).then(function(data){
        response.redirect('/message/' + otherUsername);

    }).catch(function (err) {
        response.render('pages/home.ejs',
            { error: true, message: "Error when sending message." });
    });
});

app.listen(3000);
console.log("Server is listening on port 3000");
