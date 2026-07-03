const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'roles', // Debe coincidir exactamente con el nombre del modelo de Rol
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('usuarios', usuarioSchema);