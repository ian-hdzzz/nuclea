const express = require('express');
const morgan  = require('morgan');
const path = require('path');
const  { create, engine } = require('express-handlebars');
const helpers = require('./lib/helpers');
const { json } = require('stream/consumers');
const flash = require('connect-flash');

// initialitations
const app = express();

// settings
require('dotenv').config();
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
app.use(require('./routes'));
app.use('/nuclea', require('./routes/authentication'));
app.use('/nuclea', require('./routes/dashboard'));
app.use('/nuclea', require('./routes/requests'));
app.use('/nuclea', require('./routes/objectives'));
app.use('/nuclea', require('./routes/one'));
app.use('/nuclea', require('./routes/reports'));
app.use('/nuclea', require('./routes/admin'));
app.use('/nuclea', require('./routes/profile'));
app.use('/nuclea',require('./routes/departament'));


const faltaAdministrativa = require('./routes/faltaAdministrativa.routes');
app.use('/nuclea/faltasAdministrativas', faltaAdministrativa);
// public
app.use(express.static(path.join(__dirname, 'public')));




// starting the server 
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
})