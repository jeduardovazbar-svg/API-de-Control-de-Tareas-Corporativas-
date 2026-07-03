const Rol = require('../models/roles'); // Ajusta el nombre según tu archivo de modelo

// Crear un nuevo rol (Create)
const crearRol = async (req, res) => {
    try {
        const nuevoRol = new Rol(req.body);
        await nuevoRol.save();
        res.status(201).json(nuevoRol);
    } catch (error) {
        // El error 11000 de MongoDB ocurre cuando se viola la regla 'unique' (rol duplicado)
        if (error.code === 11000) {
            return res.status(400).json({ mensaje: 'El rol ya existe' });
        }
        res.status(400).json({ mensaje: 'Error al crear el rol', error: error.message });
    }
};

// Obtener todos los roles (Read - Todo)
const obtenerRoles = async (req, res) => {
    try {
        const roles = await Rol.find();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los roles', error: error.message });
    }
};

// Obtener un rol por su ID (Read - Uno)
const obtenerRol = async (req, res) => {
    try {
        const rol = await Rol.findById(req.params.id);
        if (!rol) {
            return res.status(404).json({ mensaje: 'Rol no encontrado' });
        }
        res.status(200).json(rol);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el rol', error: error.message });
    }
};

// Actualizar un rol por su ID (Update)
const actualizarRol = async (req, res) => {
    try {
        const rolActualizado = await Rol.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (!rolActualizado) {
            return res.status(404).json({ mensaje: 'Rol no encontrado' });
        }
        res.status(200).json(rolActualizado);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ mensaje: 'Ya existe otro rol con ese nombre' });
        }
        res.status(400).json({ mensaje: 'Error al actualizar el rol', error: error.message });
    }
};

// Eliminar un rol por su ID (Delete)
const eliminarRol = async (req, res) => {
    try {
        const rolEliminado = await Rol.findByIdAndDelete(req.params.id);
        
        if (!rolEliminado) {
            return res.status(404).json({ mensaje: 'Rol no encontrado' });
        }
        res.status(200).json({ mensaje: 'Rol eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el rol', error: error.message });
    }
};

module.exports = {
    crearRol,
    obtenerRoles,
    obtenerRol,
    actualizarRol,
    eliminarRol
};