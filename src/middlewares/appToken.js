const verificarAppToken = (req, res, next) => {
  // 1. Intentar obtener el token desde la cabecera 'x-app-token' o 'Authorization'
  const tokenRecibido = req.headers['x-app-token'];

  // 2. Si el cliente no envió ningún token, rechazamos
  if (!tokenRecibido) {
    return res.status(401).json({ 
      mensaje: "Acceso denegado. Falta el token de aplicación en las cabeceras." 
    });
  }

  // 3. Comparar el token recibido con el que guardamos en las variables de entorno
  if (tokenRecibido !== process.env.APP_TOKEN) {
    return res.status(403).json({ 
      mensaje: "Acceso denegado. El token de aplicación es inválido." 
    });
  }

  // 4. Si el token es correcto, permitimos que la petición continúe a la ruta
  next();
};

module.exports = verificarAppToken;