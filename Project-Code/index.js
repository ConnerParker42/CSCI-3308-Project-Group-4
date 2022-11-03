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
    const hash = await bcrypt.hash(request.body.password, 10);
    const query = "insert into users (username, password) values ($1, $2);" //Change query to match database specs
    db.any(query, [
        request.body.username,
        hash
    ])
    .then(function(data){
        response.redirect('/login')
    })
    .catch(function (err) {
        response.redirect('/register')
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
            throw "Incorrect username or password.";
            response.redirect('/register');
        }
        else {
            request.session.user = {
                api_key: process.env.API_KEY,
            };
            request.session.save();
            response.redirect('/discover');
        }
    })
    .catch(function (err) {
        response.render('pages/login.ejs');
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