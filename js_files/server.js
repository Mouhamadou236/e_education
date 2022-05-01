"use strict";

let express = require('express')
let mustache = require('mustache-express');

let fs = require('fs');
let courses_file = require('./course');
courses_file.load('course.json');
let user_file = require('./user');
let app = express();

app.use(express.static( '../css_files_&&_images'));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended : false }));
app.use(express.static( '../css_files_&&_images'));
app.use(express.static( '../../Cours de programmation2'));
app.use(express.static( '../js_files_front_end'));

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
    if (user !== -1) {
        req.session.user = user;
        req.session.name = req.body.email;
        res.render('home');
    } else {
        res.redirect('/login')
    }
});

app.post('/new_user', (req, res) => {
    const user = user_file.new_user(req.body.firstName, req.body.lastName, req.body.email, req.body.password);
    if (user !== -1) {
      req.session.user = user;
      req.session.name = req.body.user;
      res.render('home');
    } else {
      res.redirect('/login');
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
    res.render('index');
});

//Route pour mon Profil
app.post('/Profil', (req, res) => {
    const user = user_file.update(req.body.firstName, req.body.lastName, req.body.email, req.body.password);
    res.render('home');
});

app.get('/Profil', (req, res) => {
    res.render('Profil');
});

app.get('/Licence1', (req, res) => {
    let level = courses_file.listL1();
    res.render('Licence1', {Level : level},);
})

app.get('/Licence2', (req, res) => {
    let level = courses_file.listL2();
    res.render('Licence2', {Level : level});
})

app.get('/Programmation2', (req, res) => {
    let titles = courses_file.listProg2();
    res.render('Programmation2', {Course : titles});
})

app.get('/Programmation1', (req, res) => {
    let titles = courses_file.listProg2();
    res.render('Programmation1', {Course : titles});
})

app.get('/Probabilite', (req, res) => {
    let titles = courses_file.listProbabilite();
    res.render('Probabilite', {Course : titles});
})

app.get('/Python', (req, res) => {
    let titles = courses_file.listPython();
    res.render('Python', {Course : titles});
})

app.get('/Structures_discretes', (req, res) => {
    let titles = courses_file.listStructures();
    res.render('Structures_discretes', {Course : titles});
})

app.get('/Programmation_C_et_Systemes', (req, res) => {
    let titles = courses_file.listProgC();
    res.render('ProgrammationC', {Course : titles});
})

app.get('/Algebre1', (req, res) => {
    let titles = courses_file.listAlgèbre1();
    res.render('Algebre1', {Course : titles});
})




app.listen(3107), () => console.log('Listening on http://localhost:3100');
