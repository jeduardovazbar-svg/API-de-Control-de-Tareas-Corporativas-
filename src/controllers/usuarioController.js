const Usuario = require('../models/usuarios'); // Ajusta el nombre del archivo de tu modelo si es diferente
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Supongamos que este es tu controlador de Login
const loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Buscar al usuario por su correo
    const usuario = await Usuario.findOne({ email });
    
    // Si el correo no existe en la base de datos, rechazamos
    if (!usuario) {
      return res.status(400).json({ mensaje: "Credenciales incorrectas (Correo no encontrado)" });
    }

    // 2. VERIFICACIÓN REAL DE CONTRASEÑA
    // Compara la contraseña limpia que mandó el usuario ('123') 
    // con la contraseña encriptada de la base de datos ($2b$10$...)
    const passwordCorrecto = await bcrypt.compare(password, usuario.password);

    // Si no coinciden, rechazamos
    if (!passwordCorrecto) {
      return res.status(400).json({ mensaje: "Credenciales incorrectas (Contraseña falsa)" });
    }

    // 3. Si el correo existe Y la contraseña es correcta, creamos el Payload
    const payload = {
      id: usuario._id,
      rol: usuario.rol
    };

    // 4. Firmamos el token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '8h'
    });

    // 5. Respondemos con éxito y entregamos el token
    res.status(200).json({
      mensaje: "Login exitoso",
      token: token
    });

  } catch (error) {
    res.status(500).json({ mensaje: "Error en el servidor", error: error.message });
  }
};

const registrarUsuario = async (req, res) => {
  const { email, password, rol } = req.body;

  try {
    // 1. Verificar si el usuario ya existe
    let usuario = await Usuario.findOne({ email });
    if (usuario) return res.status(400).json({ mensaje: "El usuario ya existe" });
    if (!rol) return res.status(400).json({mensaje:"Falta el rol"});
    // 2. ENCRIPTAR LA CONTRASEÑA
    // El "10" es el número de rondas de encriptación (salt rounds)
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptado = await bcrypt.hash(password, salt);

    // 3. Crear el nuevo usuario con la contraseña encriptada
    usuario = new Usuario({
      email,
      password: passwordEncriptado, // <--- Guardamos la versión segura
      rol
    });

    await usuario.save();
    res.status(201).json({ mensaje: "Usuario registrado con éxito" });

  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar", error: error.message });
  }
};


// Obtener todos los usuarios (Read - Todo)
const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los usuarios', error: error.message });
    }
};

// Obtener un usuario por su ID (Read - Uno)
const obtenerUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el usuario', error: error.message });
    }
};

// Actualizar un usuario por su ID (Update)
const actualizarUsuario = async (req, res) => {
    try {
        // El parámetro { new: true } asegura que Mongoose devuelva el documento actualizado, no el antiguo
        const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (!usuarioActualizado) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.status(200).json(usuarioActualizado);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar el usuario', error: error.message });
    }
};

// Eliminar un usuario por su ID (Delete)
const eliminarUsuario = async (req, res) => {
    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
        
        if (!usuarioEliminado) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el usuario', error: error.message });
    }
};

module.exports = {
    obtenerUsuarios,
    obtenerUsuario,
    actualizarUsuario,
    eliminarUsuario,
    loginUsuario,
    registrarUsuario
};