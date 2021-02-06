// Uso de mongoose y schemas
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Definimos el esquema
var bicicletaSchema = new Schema ({
    code: Number,
    color: String,
    modelo: String,
    ubicacion: {
        type: [Number], index: { type: '2dsphere', sparse: true}
    }
});

// 
bicicletaSchema.statics.createInstance = function(code, color, modelo, ubicacion){
    return new this({
        code: code,
        color: color,
        modelo: modelo,
        unicacion: ubicacion
    });
};

// Definimos una instancia con mongoose
bicicletaSchema.methods.toString = function() {
    return 'code: ' + this.code + ' | color: ' + this.color;
};

// Todas las bicicletas
bicicletaSchema.statics.allBicis = function(cb){
    return this.find({}, cb);
};

// Create
bicicletaSchema.statics.add = function(aBici, cb){
    this.create(aBici, cb);
};

// find byCode
bicicletaSchema.statics.findByCode = function(aCode, cb){
    return this.findOne({code: aCode}, cb);
};

// remove ByCode
bicicletaSchema.statics.removeByCode = function(aCode, cb){
    return this.deleteOne({code: aCode}, cb);
};

// Exportamos el modelo
module.exports = mongoose.model('Bicicleta', bicicletaSchema);