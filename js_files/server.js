"use strict";

let express = require('express')
let mustache = require('mustache-express');

let fs = require('fs');
let courses_file = require('./course');
courses_file.load('course.json');
let user_file = require('./user');
let app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended : false }));
app.use(express.static( '../css_files_&&_images'));

const cookieSession = require('cookie-session');
app.use(cookieSession({
    secret : 'Ahibou-Fallou',
}));

app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', '../views');

function is_authenticated(req, res, next) {
    if (req.session.user !== undefined) {
      return next();
    }
    res.status(401).send('Authentfication requise');
}    

app.use(function(req, res, next) {
    if (req.session.user !== undefined) {
        res.locals.is_authenticated = true;
        res.locals.name = req.session.name;
    }
    return next();
});

app.post('/login', (req, res) => {
    const user = user_file.login(req.body.email, req.body.password);
    if (user != -1) {
        req.session.user = user;
        req.session.name = req.body.email;
        res.redirect('./home');
    } else {
        res.redirect('./login')
    }
});

app.post('/new_user', (req, res) => {
    const user = user_file.new_user(req.body.firstName, req.body.lastName, req.body.email, req.body.password);
    if (user != -1) {
      req.session.user = user;
      req.session.name = req.body.user;
      res.redirect('/');
    } else {
      res.redirect('/');
    }
  });

  app.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/');
  });
  
  app.get('/login', (req, res) => {
    res.render('login');
  });
  
  app.get('/new_user', (req, res) => {
    res.render('new_user');
  });

app.get('/', (req, res) => {
    res.render('login'); //acceuil debut du site
});

//Routes pour les matières
/*1er_année:
    Math
    Info
    Prog
    Fonctionnement des ords
*/
app.get('/Licence1', (req, res) => {
    let titles = courses_file.list();   
    res.render('subject', {mytitle : titles});
})

app.get('/Licence2', (req, res) => {
    let titles = courses_file.list();   //=> functionn list à Faire
    res.render('subject', {mytitle : titles});
})

/*
2ème année:
    Prog 2 
    Structure
    Proba
    Langage C 
*/


/*
Examen:
    Licence 1
    Licence 2
*/


  app.listen(3100), () => console.log('Listening on http://localhost:3100');