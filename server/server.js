const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const xlsx = require('xlsx');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'polidinamicodb'
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos');
    }
});


app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de Multer para cargar archivos
const upload = multer({ dest: 'uploads/' });

// Configuración del transporte de correo (esto depende de tu proveedor de correo)
const transporter = nodemailer.createTransport({
    service: 'gmail',  // Puedes usar otro servicio, como 'Outlook' o 'Yahoo'
    auth: {
        user: 'dani.phinno11@gmail.com',  // Tu correo de envío
        pass: 'zxdl cqii xwyd ovls'          // La contraseña de tu correo
    }
});

// Función para enviar un correo con la contraseña
const enviarCorreo = (correo, password) => {
    const mailOptions = {
        from: 'dani.phinno11@gmail.com',    // Dirección de correo de envío
        to: correo,                     // Dirección de correo del estudiante
        subject: 'Tu contraseña temporal del polidinamico', // Asunto del correo
        text: `Hola,\n\nTu cuenta ha sido creada exitosamente. Tu contraseña temporal es: ${password}\n\nPor favor, cambia tu contraseña después de ingresar a tu cuenta.\n\nSaludos.` // Cuerpo del mensaje
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo:', error);
        } else {
            console.log('Correo enviado: ' + info.response);
        }
    });
};

app.post('/login', (req, res) => {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
        return res.status(400).send('Por favor, ingrese usuario y contraseña.');
    }

    // Consulta el usuario en la base de datos
    db.query('SELECT * FROM usuario WHERE usuario = ?', [usuario], async (err, results) => {
        if (err) {
            console.error('Error al consultar la base de datos:', err);
            return res.status(500).send('Error del servidor');
        }

        if (results.length === 0) {
            return res.status(401).send('Usuario o contraseña incorrectos.');
        }

        const user = results[0];

        // Compara la contraseña ingresada con el hash almacenado
        const isMatch = await bcrypt.compare(contrasena, user.contrasena);
        if (!isMatch) {
            return res.status(401).send('Usuario o contraseña incorrectos.');
        }

        // Usuario autenticado con éxito
        res.status(200).send(`Bienvenido, ${user.usuario}`);
    });
});

// Ruta para el archivo index.html
app.get('/registrarest.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'registrarest.html'));
});

// Ruta para el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Ruta para recordarclave.html
app.get('/recordarclave.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'recordarclave.html'));
});

// Ruta para obtener los estudiantes
app.get('/get-estudiantes', (req, res) => {
    const query = `
        SELECT 
            estudiante.cedula, 
            CONCAT(estudiante.nombres, ' ', estudiante.apellidos) AS nombres_completos, 
            estudiante.correo, 
            usuario.usuario AS nombre_usuario, 
            usuario.estado 
        FROM estudiante
        INNER JOIN usuario ON estudiante.cedula = usuario.cedula;
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los estudiantes:', err);
            return res.status(500).send('Error en la base de datos');
        }
        res.json(results); // Responde con los datos combinados
    });
});

// Ruta para procesar el formulario
app.post('/restablecer-clave', (req, res) => {
    const cedula = req.body.cedula;

    // Verifica si la cédula existe en la base de datos
    db.query('SELECT * FROM usuario WHERE cedula = ?', [cedula], (err, results) => {
        if (err) {
            console.error('Error al consultar la base de datos:', err);
            return res.status(500).send('Error del servidor');
        }

        if (results.length > 0) {
            res.send('Solicitud de restablecimiento procesada. Verifica tu correo.');
        } else {
            res.send('Cédula no encontrada en el sistema.');
        }
    });
});

// Función para crear usuario
const crearUsuario = (nombre, cedula, correo, callback) => {
    // Validar datos
    if (!nombre || !cedula || !correo || typeof correo !== 'string') {
        console.error('Datos inválidos:', { nombre, cedula, correo });
        return callback(new Error('Datos inválidos para crear el usuario.'));
    }

    // Generar contraseña
    const nombreCompleto = nombre.replace(/\s+/g, '').toLowerCase(); // Quitar espacios y pasar a minúsculas
    const cedulaString = cedula.toString();
    const simbolosEspeciales = '!@';
    let password = `${nombreCompleto}${cedulaString}${simbolosEspeciales}`;

    // Crear hash de la contraseña
    const hashPassword = crypto.createHash('sha256').update(password).digest('hex');

    // Crear nombre de usuario
    const username = correo.split('@')[0]; // Parte local del correo

    // Insertar en la base de datos
    const query = `
        INSERT INTO usuario (cedula, usuario, contrasena)
        VALUES (?, ?, ?)
    `;
    db.query(query, [cedula, username, hashPassword], (err, result) => {
        if (err) {
            console.error('Error al insertar el usuario en la base de datos:', err);
            return callback(err);
        }

        // Enviar la contraseña original por correo
        enviarCorreo(correo, password, (err) => {
            if (err) {
                console.error('Error al enviar el correo:', err);
                return callback(err);
            }
        });

        // Retornar el resultado y la contraseña generada
        callback(null, result, password);
    });
};


//FUncion para cambiar estado usuario
app.post('/toggle-habilitar-usuario', (req, res) => {
    const { usuario } = req.body;

    // Verifica el estado actual del usuario
    const querySelect = 'SELECT estado FROM usuario WHERE usuario = ?';
    db.query(querySelect, [usuario], (err, results) => {
        if (err || results.length === 0) {
            console.error('Error al consultar el usuario:', err || 'Usuario no encontrado');
            return res.status(500).json({ message: 'Error al consultar el usuario' });
        }

        const estadoActual = results[0].estado;
        const nuevoEstado = estadoActual === 'habilitado' ? 'inhabilitado' : 'habilitado';

        // Actualiza el estado del usuario
        const queryUpdate = 'UPDATE usuario SET estado = ? WHERE usuario = ?';
        db.query(queryUpdate, [nuevoEstado, usuario], (err) => {
            if (err) {
                console.error('Error al actualizar el estado del usuario:', err);
                return res.status(500).json({ message: 'Error al actualizar el estado del usuario' });
            }

            res.status(200).json({ message: `El usuario ha sido ${nuevoEstado}` });
        });
    });
});

// Función para insertar estudiante en la base de datos
const insertarEstudiante = (cedula, nombre, apellido, direccion, telefono, correo, programa) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO estudiante (cedula, nombres, apellidos, direccion, telefono, correo, programa)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(query, [cedula, nombre, apellido, direccion, telefono, correo, programa], (err, result) => {
            if (err) {
                console.error('Error al insertar el estudiante:', err);
                return reject(err);
            }
            resolve(result);
        });
    });
};

// Ruta para registrar estudiantes manualmente
app.post('/registrar-estudiantes', upload.single('excel'), async (req, res) => {
    const asignarPolidinamico = req.body.asignarPolidinamico === 'on';
    const registroTipo = req.body.registro_tipo;

    try {
        if (registroTipo === 'manual') {
            // Obtenemos los datos del formulario
            const cedula = req.body.cedula;
            const apellido = req.body.apellido;
            const nombre = req.body.nombre;
            const programa = req.body.programa;
            const correo = req.body.correo;
            const telefono = req.body.telefono || ''; // Si no se proporciona teléfono, lo dejamos vacío
            const direccion = req.body.direccion || ''; // Si no se proporciona dirección, lo dejamos vacío

            // Verificar que los campos obligatorios estén presentes
            if (!cedula || !nombre || !apellido || !correo) {
                return res.status(400).send('Todos los campos obligatorios deben ser completados.');
            }

            // Registrar el estudiante
            await insertarEstudiante(cedula, nombre, apellido, direccion, telefono, correo, programa);

            // Crear usuario para el estudiante
            crearUsuario(cedula, correo, (err, result, password) => {
                if (err) {
                    return res.status(500).send('Error al crear el usuario');
                }
                res.send(`Estudiante registrado con éxito. La contraseña temporal es: ${password}`);
            });
        } else if (registroTipo === 'archivo') {
            if (!req.file) {
                return res.status(400).send('No se ha cargado un archivo Excel.');
            }

            const filePath = req.file.path;
            const workbook = xlsx.readFile(filePath);
            const sheet_name_list = workbook.SheetNames;
            const sheet = workbook.Sheets[sheet_name_list[0]];

            const data = xlsx.utils.sheet_to_json(sheet);

            // Procesar los estudiantes desde el archivo Excel
            const studentPromises = data.map((student) => {
                // Verificar que los datos necesarios estén presentes
                if (!student.cedula || !student.nombre || !student.apellido || !student.correo) {
                    console.error('Faltan datos necesarios para el estudiante', student);
                    return Promise.resolve(); // Si falta algún dato, continuar con el siguiente estudiante
                }

                // Insertar estudiante en la base de datos
                return insertarEstudiante(student.cedula, student.nombre, student.apellido, student.correo, student.programa)
                    .then(() => {
                        // Crear usuario para el estudiante
                        return new Promise((resolve, reject) => {
                            crearUsuario(student.cedula, student.correo, (err, result, password) => {
                                if (err) {
                                    console.error('Error al crear el usuario desde archivo:', err);
                                    return reject(err);
                                }
                                resolve();
                            });
                        });
                    });
            });

            // Esperar que todos los estudiantes se procesen
            await Promise.all(studentPromises);

            res.send('Estudiantes registrados correctamente desde archivo');
        }
    } catch (err) {
        console.error('Error al registrar estudiantes:', err);
        res.status(500).send('Error al procesar el registro de estudiantes');
    }
});

// Función para iniciar el servidor con un puerto dinámico
function startServer(port) {
    app.listen(port, (err) => {
        if (err) {
            if (err.code === 'EADDRINUSE') {
                console.log(`Puerto ${port} en uso, intentando con el siguiente puerto...`);
                startServer(port + 1);
            } else {
                console.error('Error al iniciar el servidor:', err);
            }
        } else {
            console.log(`Servidor corriendo en http://localhost:${port}`);
        }
    });
}

// Intentar iniciar el servidor en el puerto 3003
startServer(3003);

