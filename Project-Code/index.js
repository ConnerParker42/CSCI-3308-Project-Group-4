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
    console.log("yeet)");
    await db.none('SELECT * FROM USERS WHERE username = $1', [
        request.body.username
    ])
    .then( async function(data) {
        const hash = await bcrypt.hash(request.body.password, 10);
        const query = 'insert into users (username, email, password) values ($1, $2, $3);' 
         await db.any(query, [
            request.body.username,
            request.body.email,
            hash
        ])
        .then(function(data){
            response.redirect('/login')
        })
        .catch(function (err) {
            response.render('pages/register',
            { error: true, message: err});
        });
    })
    .catch(function (err) {
        console.log("username taken");
        response.render('pages/register.ejs',
            {error: true, message: 'Username is already in use'}
        );
    });
});

app.get('/login', (request, response) => {
    response.render('pages/login.ejs');
});

app.post('/login', (request, response) => {
    const query = "select * from users where username=$1;"
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



//Request should have the user name of the user who is logging in.
//Response has usernames of people the user has sent a message to.
app.get("/home", (request, response) => {
    const query = `SELECT recipient_username FROM contacts where sender_username = $1;`;
    db.any(query, [
        request.session.user.username
    ])
    .then(function(data){
        response.render('pages/home.ejs', data);
    })
    .catch(function (err) {
        response.render('pages/home.ejs',
            { error: true, message: "Error when getting home data." });
    });
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.render("pages/login", {
        message: 'Successfully logged out'
    });
});

app.listen(3000);
console.log("Server is listening on port 3000");
