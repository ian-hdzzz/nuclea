const express = require('express');
const session = require('express-session');
const morgan  = require('morgan');
const path = require('path');
const  { create, engine } = require('express-handlebars');
const helpers = require('./lib/helpers');
const { json } = require('stream/consumers');
const flash = require('connect-flash');
const { isAuthenticated } = require('./controllers/authController');
const dotenv = require('dotenv');
dotenv.config();

// initialitations
const app = express();

// settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
const exphbs = create({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'pages'),
    partialsDir: path.join(__dirname, 'views', 'partials'),
    extname: '.hbs',
    helpers: helpers
  });
app.engine('.hbs', exphbs.engine); 
app.set('view engine', '.hbs');

// middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static('public'));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 día
    secure: false // Cambia a true si usas HTTPS
  }
}));
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn || false;
  res.locals.user = req.session.email || null;
  next();
});
// global variables
app.use(flash());
// app.use((req, res, next) => {
//     res.locals.message = req.flash('message');
//     res.locals.success = req.flash('success');
//     res.locals.user = req.user;
//     res.locals.currentPath = req.path
//     next();
// });
// test data


// routes 
app.use(require('./routes/index.routes'));
app.use('/nuclea', require('./routes/authentication.routes'));
app.use('/nuclea',isAuthenticated, require('./routes/dashboard.routes'));
app.use('/nuclea',isAuthenticated, require('./routes/requests.routes'));
app.use('/nuclea',isAuthenticated, require('./routes/one.routes'));
app.use('/nuclea',isAuthenticated, require('./routes/reports.routes'));
app.use('/nuclea',isAuthenticated, require('./routes/admin.routes'));
app.use('/nuclea',isAuthenticated, require('./routes/faltaAdministrativa.routes'));
// app.use('/nuclea', require('./routes/objectives'));

// public
app.use(express.static(path.join(__dirname, 'public')));

// starting the server 
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
})