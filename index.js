require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');

const app = express();

// Middleware para entender JSON
app.use(express.json());

// Importar los controladores existentes
const usuarioController = require('./src/controllers/usuarioController');
const rolController = require('./src/controllers/rolController');
const tareaController = require('./src/controllers/tareaController');

// --- DOCUMENTACIÓN SWAGGER (Todo en index.js) ---
const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'API de Gestión de Tareas, Usuarios y Roles',
        version: '1.0.0',
        description: 'Panel interactivo unificado para probar todos los endpoints de la API de forma limpia.',
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT || 3000}`,
            description: 'Servidor Local'
        }
    ],
    // Definimos las etiquetas para agrupar los endpoints visualmente
    tags: [
        { name: 'Roles', description: 'Operaciones para gestionar roles de usuario' },
        { name: 'Usuarios', description: 'Operaciones para gestionar usuarios' },
        { name: 'Tareas', description: 'Operaciones para gestionar tareas' }
    ],
    paths: {
        // === ENDPOINTS DE ROLES ===
        '/api/roles': {
            get: {
                tags: ['Roles'],
                summary: 'Obtener todos los roles',
                responses: {
                    200: { description: 'Lista de roles obtenida con éxito.' }
                }
            },
            post: {
                tags: ['Roles'],
                summary: 'Crear un nuevo rol',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    nombre: { type: 'string', example: 'Administrador' },
                                    descripcion: { type: 'string', example: 'Control total del sistema' }
                                },
                                required: ['nombre']
                            }
                        }
                    }
                },
                responses: {
                    201: { description: 'Rol creado exitosamente.' },
                    400: { description: 'Error en los datos o rol duplicado.' }
                }
            }
        },
        '/api/roles/{id}': {
            get: {
                tags: ['Roles'],
                summary: 'Obtener un rol por ID',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Rol encontrado.' }, 404: { description: 'Rol no encontrado.' } }
            },
            put: {
                tags: ['Roles'],
                summary: 'Actualizar un rol por ID',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    nombre: { type: 'string' },
                                    descripcion: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: 'Rol actualizado.' }, 404: { description: 'Rol no encontrado.' } }
            },
            delete: {
                tags: ['Roles'],
                summary: 'Eliminar un rol por ID',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Rol eliminado.' }, 404: { description: 'Rol no encontrado.' } }
            }
        },

        // === ENDPOINTS DE USUARIOS ===
        '/api/usuarios': {
            get: {
                tags: ['Usuarios'],
                summary: 'Obtener todos los usuarios',
                responses: { 200: { description: 'Lista de usuarios obtenida.' } }
            },
            post: {
                tags: ['Usuarios'],
                summary: 'Crear un nuevo usuario',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string', example: 'user@example.com' },
                                    password: { type: 'string', example: '123456' },
                                    rol: { type: 'string', description: 'ID del Rol asignado (MongoDB ObjectId)' }
                                },
                                required: ['email', 'password', 'rol']
                            }
                        }
                    }
                },
                responses: { 201: { description: 'Usuario creado.' }, 400: { description: 'Error en los datos.' } }
            }
        },
        '/api/usuarios/{id}': {
            get: {
                tags: ['Usuarios'],
                summary: 'Obtener un usuario por ID',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Usuario encontrado.' }, 404: { description: 'Usuario no encontrado.' } }
            },
            put: {
                tags: ['Usuarios'],
                summary: 'Actualizar un usuario por ID',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string' },
                                    password: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: 'Usuario actualizado.' } }
            },
            delete: {
                tags: ['Usuarios'],
                summary: 'Eliminar un usuario por ID',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Usuario eliminado.' } }
            }
        },

        // === ENDPOINTS DE TAREAS ===
        '/api/tareas': {
            get: {
                tags: ['Tareas'],
                summary: 'Obtener todas las tareas',
                responses: { 200: { description: 'Lista de tareas cargada.' } }
            },
            post: {
                tags: ['Tareas'],
                summary: 'Crear una nueva tarea',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    titulo: { type: 'string', example: 'Completar reporte' },
                                    cuerpo: { type: 'string', example: 'Redactar el balance mensual' },
                                    usuario: { type: 'string', description: 'ID del Usuario asignado (MongoDB ObjectId)' }
                                },
                                required: ['titulo', 'cuerpo', 'usuario']
                            }
                        }
                    }
                },
                responses: { 201: { description: 'Tarea creada con éxito.' } }
            }
        },
        '/api/tareas/{id}': {
            get: {
                tags: ['Tareas'],
                summary: 'Obtener una tarea por ID',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Tarea encontrada.' } }
            },
            put: {
                tags: ['Tareas'],
                summary: 'Actualizar una tarea por ID',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    titulo: { type: 'string' },
                                    cuerpo: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: 'Tarea modificada.' } }
            },
            delete: {
                tags: ['Tareas'],
                summary: 'Eliminar una tarea por ID',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Tarea eliminada de la base de datos.' } }
            }
        }
    }
};

// Servir la interfaz de Swagger en la ruta `/api-docs`
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// --- ENRUTAMIENTO DIRECTO A LOS CONTROLADORES ---
// Roles
app.post('/api/roles', rolController.crearRol);
app.get('/api/roles', rolController.obtenerRoles);
app.get('/api/roles/:id', rolController.obtenerRol);
app.put('/api/roles/:id', rolController.actualizarRol);
app.delete('/api/roles/:id', rolController.eliminarRol);

// Usuarios
app.post('/api/usuarios', usuarioController.crearUsuario);
app.get('/api/usuarios', usuarioController.obtenerUsuarios);
app.get('/api/usuarios/:id', usuarioController.obtenerUsuario);
app.put('/api/usuarios/:id', usuarioController.actualizarUsuario);
app.delete('/api/usuarios/:id', usuarioController.eliminarUsuario);

// Tareas
app.post('/api/tareas', tareaController.crearTarea);
app.get('/api/tareas', tareaController.obtenerTareas);
app.get('/api/tareas/:id', tareaController.obtenerTarea);
app.put('/api/tareas/:id', tareaController.actualizarTarea);
app.delete('/api/tareas/:id', tareaController.eliminarTarea);


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