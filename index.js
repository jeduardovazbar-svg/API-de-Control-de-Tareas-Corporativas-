require('dotenv').config(); // Cargar las variables de entorno al inicio
const express = require('express');
const mongoose = require('mongoose'); // Importar Mongoose

const app = express();

// Middleware
app.use(express.json());

// Importar rutas
const usuarioRoutes = require('./src/routes/usuarioRoutes'); // Ajusta la ruta si es necesario
const rolRoutes = require('./src/routes/rolRoutes');
const tareaRoutes = require('./src/routes/tareaRoutes');

// Usar rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/roles', rolRoutes);
app.use('/api/tareas', tareaRoutes);

// --- CONEXIÓN A MONGODB ---
const uri = process.env.MONGO_URI; // Leer la variable de tu archivo .env

mongoose.connect(uri)
    .then(() => {
        console.log('✅ Conectado exitosamente a MongoDB');
        
        // Solo levantamos el servidor si la base de datos se conectó bien
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ Error al conectar a MongoDB:', error.message);
    });