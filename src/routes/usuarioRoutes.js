const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Rutas para Usuarios
router.post('/', usuarioController.registrarUsuario);
router.post('/login', usuarioController.loginUsuario);
router.get('/', usuarioController.obtenerUsuarios);
router.get('/:id', usuarioController.obtenerUsuario);
router.put('/:id', usuarioController.actualizarUsuario); // Puedes usar .patch también
router.delete('/:id', usuarioController.eliminarUsuario);


module.exports = router;