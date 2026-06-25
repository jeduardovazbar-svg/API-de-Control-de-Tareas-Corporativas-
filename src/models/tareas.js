const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        unique: true
    },
    cuerpo: {
        type: String,
        required: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario', // Relaciona la tarea con un usuario específico
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now // Quitamos los paréntesis ()
    }
});

module.exports = mongoose.model('tareas', tareaSchema);