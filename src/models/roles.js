const mongoose = require('mongoose');

const rolSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true, // Evita que se duplique el mismo rol
        trim: true
    },
    descripcion: {
        type: String, // Opcional: para saber qué hace cada rol
    },
    fechaCreacion: {
        type: Date,
        default: Date.now // Sin paréntesis () para que se ejecute al insertar
    }
});


module.exports = mongoose.model('Rol', rolSchema);