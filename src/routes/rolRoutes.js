const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rolController');

// Rutas para Roles
router.post('/', rolController.crearRol);
router.get('/', rolController.obtenerRoles);
router.get('/:id', rolController.obtenerRol);
router.put('/:id', rolController.actualizarRol);
router.delete('/:id', rolController.eliminarRol);

module.exports = router;