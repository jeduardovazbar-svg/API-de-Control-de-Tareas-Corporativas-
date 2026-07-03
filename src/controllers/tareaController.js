const Tarea = require('../models/tareas'); // Ajusta la ruta si es necesario

// Crear una nueva tarea (Create)
const crearTarea = async (req, res) => {
    try {
        const nuevaTarea = new Tarea(req.body);
        await nuevaTarea.save();
        res.status(201).json(nuevaTarea);
    } catch (error) {
        // Manejo del error si se intenta registrar un título duplicado
        if (error.code === 11000) {
            return res.status(400).json({ mensaje: 'Ya existe una tarea con ese título' });
        }
        res.status(400).json({ mensaje: 'Error al crear la tarea', error: error.message });
    }
};

// Obtener todas las tareas (Read - Todo)
const obtenerTareas = async (req, res) => {
    try {
        // .populate('usuario') trae los datos del usuario relacionado. 
        // Puedes ponerle un segundo parámetro si solo quieres ciertos campos, ej: populate('usuario', 'email rol')
        const tareas = await Tarea.find().populate('usuario'); 
        res.status(200).json(tareas);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las tareas', error: error.message });
    }
};

// Obtener una tarea por su ID (Read - Uno)
const obtenerTarea = async (req, res) => {
    try {
        const tarea = await Tarea.findById(req.params.id).populate('usuario');
        if (!tarea) {
            return res.status(404).json({ mensaje: 'Tarea no encontrada' });
        }
        res.status(200).json(tarea);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener la tarea', error: error.message });
    }
};

// Actualizar una tarea por su ID (Update)
const actualizarTarea = async (req, res) => {
    try {
        const tareaActualizada = await Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (!tareaActualizada) {
            return res.status(404).json({ mensaje: 'Tarea no encontrada' });
        }
        res.status(200).json(tareaActualizada);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ mensaje: 'Ya existe otra tarea con ese título' });
        }
        res.status(400).json({ mensaje: 'Error al actualizar la tarea', error: error.message });
    }
};

// Eliminar una tarea por su ID (Delete)
const eliminarTarea = async (req, res) => {
    try {
        const tareaEliminada = await Tarea.findByIdAndDelete(req.params.id);
        
        if (!tareaEliminada) {
            return res.status(404).json({ mensaje: 'Tarea no encontrada' });
        }
        res.status(200).json({ mensaje: 'Tarea eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar la tarea', error: error.message });
    }
};

module.exports = {
    crearTarea,
    obtenerTareas,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea
};