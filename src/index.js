const express = require('express');
const morgan = require('morgan');
const path = require('path');
const { create, engine } = require('express-handlebars');
const helpers = require('./lib/helpers');
const { json } = require('stream/consumers');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('./util/passport'); // Importar configuración de Passport
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // Añadimos cookie-parser

// initialitations
const app = express();

// settings
require('dotenv').config();
app.set('port', process.env.PORT || 4002);
app.set('views', path.join(__dirname, 'views'));
const exphbs = create({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'pages'),
    partialsDir: path.join(__dirname, 'views', 'partials'),
    extname: '.hbs',
    helpers: require('./lib/helpers'),
});
app.engine('.hbs', exphbs.engine); 
app.set('view engine', '.hbs');

// Configurar raw body parsing para webhooks de WhatsApp antes de otros middleware
app.use('/api/whatsapp/webhook', express.raw({ type: 'application/json' }));

// middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static('public'));
app.use(cookieParser()); // Añadimos el middleware de cookie-parser

// Configuración de la sesión
app.use(session({
    secret: 'mi string secreto que debe ser un string aleatorio muy largo, no como éste', 
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // en producción pon esto en true con HTTPS
        maxAge: 3600000
      }
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const multer = require('multer');
const fileStorage = multer.diskStorage({
    destination: (request, file, callback) => {
        const uploadPath = path.join(__dirname, 'public/Uploads');
        callback(null, uploadPath);
    },
    filename: (request, file, callback) => {
        callback(null, new Date().getMilliseconds() + file.originalname);
    },
});

app.use(multer({ storage: fileStorage}).single('archivo')); 

// Configuración de CSRF
const csrf = require('csurf');
const csrfProtection = csrf({
    cookie: true,
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
    ignore: (req) => {
        // Ignorar rutas de API y webhooks
        return req.path.startsWith('/api/') || 
               req.path.includes('/webhook') ||
               req.path.includes('/agendar-one-to-one');
    }
});

// Aplicar protección CSRF después de las rutas de API
const whatsappRoutes = require('./routes/whatsapp.routes');
app.use('/api/whatsapp', whatsappRoutes);

app.use(csrfProtection);

// Variables globales
app.use(flash());
app.use((req, res, next) => {
    res.locals.user = req.user; // Hacer disponible el usuario en las vistas
    res.locals.csrfToken = req.csrfToken();
    res.locals.message = req.flash('message');
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.privilegios = req.session.privilegios || [];
    next();
});

// Rutas
app.use(require('./routes/index.routes'));
app.use(require('./routes/google.routes'));
app.use('/nuclea', require('./routes/authentication.routes'));
app.use('/nuclea', require('./routes/dashboard.routes'));
app.use('/nuclea', require('./routes/request.routes'));
app.use('/nuclea', require('./routes/objectives.routes'));
app.use('/nuclea', require('./routes/search.routes'));
app.use('/nuclea', require('./routes/one.routes'));
app.use('/nuclea', require('./routes/reports.routes'));
app.use('/nuclea', require('./routes/admin.routes'));
app.use('/nuclea', require('./routes/profile.routes'));
app.use('/nuclea', require('./routes/my-events.routes'));
app.use('/nuclea', require('./routes/agendar.routes')); // Nueva ruta para agendar one-to-one
const departamentRoutes = require('./routes/departament.routes');
app.use('/nuclea/departament', departamentRoutes);
const faltaAdministrativa = require('./routes/faltaAdministrativa.routes');
app.use('/nuclea/faltasAdministrativas', faltaAdministrativa);
const users = require('./routes/users.routes');
app.use('/nuclea/users', users);

const viewcollabs = require('./routes/viewcollabs.routes');
app.use('/nuclea/viewcollabs', viewcollabs);

const holidayRoutes = require('./routes/holiday.routes');
app.use('/nuclea/holiday', holidayRoutes);

const companyRoutes = require('./routes/company.routes');
app.use('/nuclea/company', companyRoutes);

const inactiveRoutes = require('./routes/unemployed.routes');
app.use('/nuclea', inactiveRoutes);

const tutorialRoutes = require('./routes/tutorial.routes');
app.use('/nuclea/tutorial', tutorialRoutes);
// public
app.use(express.static(path.join(__dirname, 'public')));

// starting the server 
app.listen(app.get('port'),() => {
    console.log('Server on port', app.get('port'));
});