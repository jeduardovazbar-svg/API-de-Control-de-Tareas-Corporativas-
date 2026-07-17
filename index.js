require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const verificarAppToken = require('./src/middlewares/appToken');

const app = express();

// Middleware para entender JSON
app.use(express.json());
app.use(verificarAppToken);//verificamos el token de app
// Importar los controladores existentes
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const rolRoutes = require('./src/routes/rolRoutes');
const tareaRoutes = require('./src/routes/tareaRoutes');




app.get('/', (req, res) => {
    res.send('🚀 ¡API Financiera corriendo con éxito en Render!');
});

// --- ENRUTAMIENTO DIRECTO A LOS CONTROLADORES ---
// Roles
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/tareas', tareaRoutes);
app.use('/api/roles', rolRoutes);


// --- CONEXIÓN A MONGODB ---
const uri = process.env.MONGO_URI;

mongoose.connect(uri)
    .then(() => console.log('✅ Conectado exitosamente a MongoDB'))
    .catch((error) => console.error('❌ Error al conectar a MongoDB:', error.message));


// >>> SOLUCIÓN PARA RENDER: Solo levanta el puerto si NO estás en Vercel <<<
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    });
}

// >>> SOLUCIÓN PARA VERCEL: Exportar la app <<<
module.exports = app;