require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;

// 1. Middleware para que Express entienda los datos en formato JSON que envíe el cliente
app.use(express.json());

// 2. Una ruta de prueba para verificar que el servidor responde en el navegador o Postman
app.get('/', (req, res) => {
    res.send('¡Servidor corriendo y listo para los modelos!');
});


app.listen(PORT, () => console.log(`Conectado a la base de datos en el puerto ${PORT}`));