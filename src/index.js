// Load environment variables first
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const path = require('path');
const { create } = require('express-handlebars');
const helpers = require('./lib/helpers');
const { json } = require('stream/consumers');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const multer = require('multer');
const passport = require('./util/passport'); // Import configured passport

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
    secret: process.env.SESSION_SECRET || 'mi string secreto que debe ser un string aleatorio muy largo, no como éste', 
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Google authentication routes
app.get('/auth/google', (req, res, next) => {
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    state: req.query.popup === 'true' ? 'popup=true' : undefined
  })(req, res, next);
});

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: 'https://www.youtube.com/watch?v=eThEZejP2b8' }),
  (req, res) => {
    // Check if state indicates this is a popup
    const isPopup = req.query.state && req.query.state.includes('popup=true');
    
    if (isPopup) {
      // Return HTML that will close the popup and notify the parent window
      res.send(`
        <html>
          <body>
            <script>
              window.opener.postMessage({ authSuccess: true }, '*');
              window.close();
            </script>
          </body>
        </html>
      `);
    } else {
      // Normal redirect flow
      res.redirect('https://www.youtube.com/watch?v=eThEZejP2b8'); // Or wherever you want to redirect after login
    }
  }
);

app.use(bodyParser.urlencoded({extended: false}));

//fileStorage: Es nuestra constante de configuración para manejar el almacenamiento
const fileStorage = multer.diskStorage({
    destination: (request, file, callback) => {
        //'uploads': Es el directorio del servidor donde se subirán los archivos 
        const uploadPath = path.join(__dirname, 'public/uploads');
        callback(null, uploadPath);
    },
    filename: (request, file, callback) => {
        //aquí configuramos el nombre que queremos que tenga el archivo en el servidor, 
        //para que no haya problema si se suben 2 archivos con el mismo nombre concatenamos el timestamp
        callback(null, new Date().getMilliseconds() + file.originalname);
    },
});

app.use(multer({ storage: fileStorage}).single('archivo')); 

const csrf = require('csurf');
const csrfProtection = csrf();
app.use(csrfProtection);

// global variables
app.use(flash());

// routes 
app.use(require('./routes/index.routes'));
app.use('/nuclea', require('./routes/authentication.routes'));
app.use('/nuclea', require('./routes/dashboard.routes'));
app.use('/nuclea', require('./routes/requests.routes'));
app.use('/nuclea', require('./routes/objectives.routes'));
app.use('/nuclea', require('./routes/interview.routes'));
app.use('/nuclea', require('./routes/reports.routes'));
app.use('/nuclea', require('./routes/admin.routes'));
app.use('/nuclea', require('./routes/profile.routes'));


const departamentRoutes = require('./routes/departament.routes');
app.use('/nuclea', departamentRoutes);

const faltaAdministrativa = require('./routes/faltaAdministrativa.routes');
app.use('/nuclea/faltasAdministrativas', faltaAdministrativa);

const users = require('./routes/users.routes');
app.use('/nuclea/users', users);

// public
app.use(express.static(path.join(__dirname, 'public')));

// starting the server 
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});