var Bicicleta = require('../models/bicicleta');

exports.bicicleta_list = function(req, res){
    res.render('bicicletas/index', {bicis: Bicicleta.allBicis});
}

// controller de create GET
exports.bicicleta_create_get = function(req, res){
    res.render('bicicletas/create');
}

// controller de create POST
exports.bicicleta_create_post = function(req, res){
    var bici = new Bicicleta(req.body.id, req.body.color, req.body.modelo);
    bici.ubicacion = [req.body.lat, req.body.lng];
    Bicicleta.add(bici);

    res.redirect('/bicicletas');
}

// controller de update o actualizar GET
exports.bicicleta_update_get = function(req, res){
    var bici = Bicicleta.findById(req.params.id);

    res.render('bicicletas/update', {bici});
}

// controller de update o actualizar POST
exports.bicicleta_update_post = function(req, res){
    var bici = Bicicleta.findById(req.params.id);
    bici.id = req.body.id;
    bici.color = req.body.color;
    bici.modelo = req.body.modelo;
    bici.ubicacion = [req.body.lat, req.body.lng];

    res.redirect('/bicicletas');
}

// Controller delete
exports.bicicleta_delete_post = function(req, res){
    Bicicleta.removeById(req.body.id);

    res.redirect('/bicicletas');
}