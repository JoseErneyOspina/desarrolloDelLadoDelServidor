var express = require('express');
var router = express.Router();
var bicicletaController = require('../controllers/bicicleta');

router.get('/', bicicletaController.bicicleta_list);

// Rutas create
router.get('/create', bicicletaController.bicicleta_create_get);
router.post('/create', bicicletaController.bicicleta_create_post);
// Rutas update o actualizar
router.get('/:id/update', bicicletaController.bicicleta_update_get);
router.post('/:id/update', bicicletaController.bicicleta_update_post);
// Rutas delete
router.post('/:id/delete', bicicletaController.bicicleta_delete_post);
// con los:id le definimos a la ruta que es parametro es decir sale primero el id de la bicicleta y luego el /delete


module.exports = router;