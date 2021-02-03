var mongoose = require('mongoose');
// Traemos el unique
const uniqueValidator = require('mongoose-unique-validator');
var Reserva = require('./reserva');
var Schema = mongoose.Schema;

// Usamos el bcrypt
const bcrypt = require('bcrypt');
// Definimos el salt
const salRounds = 10;

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

module.exports = mongoose.model('Usuario', usuarioSchema);