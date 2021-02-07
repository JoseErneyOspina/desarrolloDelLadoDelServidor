require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// Incluimos
const passport = require('./config/passport');
// Creamos el objeto session
const session = require('express-session');
// Traemos el modulo de JsonWebToken
const jwt = require('jsonwebtoken');

var indexRouter = require('./routes/index');
// Agregamos usuarios
var usuariosRouter = require('./routes/usuarios');
// Agregamos token
var tokenRouter = require('./routes/token');
var usersRouter = require('./routes/users');
var bicicletasRouter = require('./routes/bicicletas');
var bicicletasAPIRouter = require('./routes/api/bicicletas');
var usuarioAPIRouter = require('./routes/api/usuarios');

// Definimos un objeto store para definir cual es motor de session que vamos a usar
// Utilizamos el MemoryStore sera bastante agil ya que quedara en la memoria del servidor
const store = session.MemoryStore;

var app = express();
// Agregamos el secret key - esta va a se la semilla del cifrado
app.set('secretKey', 'jwt_pwd_!!223344');
// Lo que hacemos una vez definido el express es decirle a app que use session
app.use(session({
  cookie: { mazAge: 240 * 60 * 60 * 1000 },
  sote: store,
  saveUninitialized: true,
  resave: 'true',
  secret: 'red_bicis_!!!***!".!".!".!".123123'
}));

// Referenciamos a moongoose
var mongoose = require('mongoose');

//var mongoDB = 'mongodb://localhost/red_bicicletas';
//mongodb+srv://admin:<>g9vNvez@MgXaXfy2]PN>@bike-red.lhcl7.mongodb.net/<dbname>?retryWrites=true&w=majority
// si estoy en el ambiente de desarrollo usar
//var mongoDB = 'mongodb://localhost/red_bicicletas';
// si no usar
//var mongoDB = 'mongodb+srv://admin:<>g9vNvez@MgXaXfy2]PN>@bike-red.lhcl7.mongodb.net/<dbname>?retryWrites=true&w=majority';
// Reemplazamos ya que usamos las variables .env
// Esto lo que hace es identificar cual es la connection string que usaremos en el caso de ambiente
var mongoDB = process.env.MONGO_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Despues del cookieParser también inicializar passport y passport.session
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));




app.get('/login', function(req, res){
  res.render('session/login');
});

app.post('/login', function(req,res,next){
  passport.authenticate('local', function(err, usuario, info){
    if (err) return next(err);
    if (!usuario) return res.render('session/login', {info});
    req.login(usuario,function(err){
      if (err) return next(err);
      return res.redirect('/');
    });
  })(req, res, next);
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/forgotPassword', function(req,res){
  res.render('session/forgotPassword');
});

app.post('/forgotPassword', function(req, res, next){
  Usuario.findOne({ email: req.body.email }, function(err, usuario) {
    if(!usuario) return res.render('session/forgotPassword', { info: { message: 'No existe el email para un usuario existente.' }});
    usuario.resetPassword(function(err){
      if(err) return next(err);
      console.log('session/forgotPasswordMessage');
    })
    res.render('session/forgotPasswordMessage');
  })
});

app.get('/resetPassword/:token', function(req,res,next){
  Token.findOne({ token: req.params.token }, function (err, token){
    if (!token) return res.status(400).send({ msg: 'No existe un usuario asociado al token. Verifique que su token no haya expirado.' });
    
    Usuario.findById(token._userId, function (err, usuario){
      if (!usuario) return res.status(400).send({ msg: 'No existe un usuario asociado al token. '});
      res.render('session/resetPassword', { errors: {}, usuario: usuario});
    });
  });
});

app.post('/resetPassword', function(req, res){
  if (req.body.password != req.body.confirm_password) {
    res.render('session/resetPassword', {errors: {confirm_password: {message: 'No coincide con el password ingresado'}},
    usuario: new Usuario({email: req.body.email})});
    return;
  }
  Usuario.findOne({ email: req.body.email }, function (err, usuario) {
    usuario.password = req.body.password;
    usuario.save(function(err){
      if (err) {
        res.render('session/resetPassword', { errors: err.errors, usuario: new Usuario({email: req.body.email})});
      }else{
        res.redirect('/login');
      }
    });
  });
});




app.use('/', indexRouter);
// Agremaos el app.use de usuarios
app.use('/usuarios', usuariosRouter);
// Agregamos el app.use de token
app.use('/token', tokenRouter);
app.use('/bicicletas', loggedIn, bicicletasRouter);

app.use('/users', usersRouter);

app.use('/api/auth', authApiRouter);
app.use('/api/bicicletas', validarUsuario, bicicletasApiRouter);
app.use('/api/usuarios', usuariosAPIRouter);

//Agregamos la ruta a privacy policy
app.use('/privacy_policy', function(req, res){
  res.sendFile('public/policy_privacy.html');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//funcion para saber si es logged
function loggedIn(req, res, next) {
  if (req.user){
    next();
  }else{
    console.log('Usuario sin loguarse');
    res.redirect('/login');
  }
};

function validarUsuario (req, res, next) {
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decoded){
    if(err) {
      res.json({ status: "error", message: err.message, data: null })
    } else {
      req.body._userId = decoded.id;
      console.log('jwt verify: ' + decoded);

      next();
    }
  });
}

module.exports = app;