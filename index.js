require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose'); // 1. Importamos Mongoose
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 2. Intentar la conexión a la Base de Datos usando la URI de tu .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
      console.log('✅ ¡Conexión exitosa a MongoDB Atlas!');
  })
  .catch((error) => {
      console.error('❌ Error al conectar a la base de datos:', error.message);
  });

// También puedes escuchar eventos globales de la conexión si lo prefieres:
const db = mongoose.connection;
db.on('error', (err) => console.error('💥 Error en la conexión activa de la DB:', err));
db.once('open', () => console.log('🚀 Base de datos lista para recibir consultas.'));


app.get('/', (req, res) => {
    res.send('¡Servidor corriendo y listo para los modelos!');
});

// Tu ruta de la tarea de JWT...
app.post('/login', (req, res) => { /* ... código anterior ... */ });

app.listen(PORT, () => console.log(`💻 Servidor local corriendo en el puerto ${PORT}`));