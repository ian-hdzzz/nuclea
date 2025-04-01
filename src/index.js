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

const session = require('express-session');
app.use(session({
    secret: 'mi string secreto que debe ser un string aleatorio muy largo, no como éste', 
    resave: false, //La sesión no se guardará en cada petición, sino sólo se guardará si algo cambió 
    saveUninitialized: false, //Asegura que no se guarde una sesión para una petición que no lo necesita
}));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

const multer = require('multer');


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

/*
const fileFilter = (request, file, callback) => {
    if (file.mimetype == 'application/pdf') {
            callback(null, true);
    } else {
            callback(null, false);
    }
}
*/

//En el registro, pasamos la constante de configuración y
//usamos single porque es un sólo archivo el que vamos a subir, 
//pero hay diferentes opciones si se quieren subir varios archivos. 
//'archivo' es el nombre del input tipo file de la forma
app.use(multer({ storage: fileStorage}).single('archivo')); 

const csrf = require('csurf');
const csrfProtection = csrf();
app.use(csrfProtection);

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
app.use('/nuclea', require('./routes/dashboard.routes'));
app.use('/nuclea', require('./routes/requests.routes'));
app.use('/nuclea', require('./routes/objectives.routes'));
app.use('/nuclea', require('./routes/interview.routes'));
app.use('/nuclea', require('./routes/reports.routes'));
app.use('/nuclea', require('./routes/admin.routes'));
app.use('/nuclea', require('./routes/profile.routes'));


const departamentRoutes = require('./routes/departament.routes');
app.use('/nuclea/departament', departamentRoutes);

const faltaAdministrativa = require('./routes/faltaAdministrativa.routes');
app.use('/nuclea/faltasAdministrativas', faltaAdministrativa);

const users = require('./routes/users.routes');
app.use('/nuclea/users', users);
// public
app.use(express.static(path.join(__dirname, 'public')));




// starting the server 
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
})