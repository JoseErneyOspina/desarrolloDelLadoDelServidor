var mongoose = require('mongoose');
// Traemos el unique
const uniqueValidator = require('mongoose-unique-validator');
var Reserva = require('./reserva');
// Usamos el bcrypt
const bcrypt = require('bcrypt');
// Incorporamos la libreria crypto
const crypto = require('crypto');
// Definimos el salt
const salRounds = 10;

const Token =require('../models/token');
const mailer = require('../mailer/mailer');

var Schema = mongoose.Schema;


const validateEmail = function(email) {
    // Utilizamos un regex para validar el email
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return re.test(email);
}

var usuarioSchema = new Schema({
    nombre: {
        type: String,
        // Cuando haya espacios al inicio o al final se desaparecen
        trin: true,
        required: [true, 'El nombre es obligatorio']
    },
    // Agregamos el email:
    email: {
        type: String,
        trin: true,
        required: [true, 'El email es obligatorio'],
        lowercase: true,
        // Un usuario por email
        unique: true,
        validate: [validateEmail, 'Por favor, ingrese un email valido'],
        match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/],
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verificado: {
        type: Boolean,
        default: false,
    },
});

// Agregamos el unique validator como Plugin al Schema
usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} ya existe con otro usuario.' });

// Agregamos un metodo más
usuarioSchema.pre('save', function(next){
    if (this.isModified('password')){
        this.password = bcrypt.hashSync(this.password, saltRounds);
    }
    next();
});

// Agregamos la comporación de los password
usuarioSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

usuarioSchema.methods.reservar = function(biciId, desde, hasta, cb){
    var reserva = new Reserva({usuario: this._id, bicicleta: biciId, desde: desde, hasta: hasta});
    console.log(reserva);
    reserva.save(cb);
};

// Agregamos nuevo metodo enviar email de bienvenida
usuarioSchema.methods.enviar_email_bienvenida = function(cb) {
    const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;
    token.save(function (err) {
        if (err) { return console.log(err.message); }

        const mailOptions = {
            from: 'no-reply@redbicicletas.com',
            to: email_destination,
            subject: 'Verificación de cuenta',
            text: 'Hola,\n\n' + 'Por favor, para verificar su cuenta haga click en este link: \n' + 'http://localhost:3000' + '\/token/confirmation\/' + token.token + '.\n'
        };

        mailer.sendMail(mailOptions, function(err) {
            if (err) { return console.log(err.message); }

            console.log('Se ha enviado un email de bienvenida a: '+ email_destination + '.' );
        });
    });
}

usuarioSchema.methods.resetPassword = function(cb) {
    const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;
    token.save(function (err) {
        if (err) { return cb(err); }

        const mailOptions = {
            from: 'no-reply@redbicicletas.com',
            to: email_destination,
            subject: 'Reseteo de password de cuenta ',
            text: 'Hola,\n\n' + 'Por favor, para resetear el password de su cuenta haga click en este link: \n' + ' http://localhost:5001' + '\/resetPassword\/' + token.token + '.\n'
        };
        
        mailer.sendMail(mailOptions, function (err){
            if (err) { return cb(err); }

            console.log('Se envio un email para resetear el password a: ' +  email_destination + '.');
        });
        
        cb(null);
    });
}


// Metodo estatico GOOGLE
usuarioSchema.statics.findOneOrCreateByGoogle = function findOneOrCreate(condition, callback) {
    const self = this;
    console.log('condition: ', condition)
    self.findOne({
        $or:[
            {'googleId': condition.id},{'email': condition.emails[0].value}
        ]}, (err, result) => {
            if (result) {
                callback(err,result)
            }else{
                console.log('--------------- CONDITION -----------------');
                console.log(condition);
                let values = {};
                values.googleId = condition.id;
                values.email = condition.emails[0].value;
                values.nombre = condition.displayName || 'SIN NOMBRE';
                values.verificado = true;
                values.password = crypto.randomBytes(16).toString('hex');
                console.log('--------------- VALUES --------------------');
                console.log(values);
                self.create(values, (err, result) => {
                    if (err) { console.log(err);}
                    return callback(err,result)
                })
            }
        })
};
// FIN del Metodo estatico GOOGLE

module.exports = mongoose.model('Usuario', usuarioSchema);