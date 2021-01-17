var express = require('express');
var router = express.Router();
var bicicletaController = require('../../controllers/api/bicicletaControllerAPI');

router.get('/', bicicletaController.bicicleta_list);
// Path create
router.post('/create', bicicletaController.bicicleta_create);
// Path delete
router.delete('/delete', bicicletaController.bicicleta_delete);

module.exports = router;