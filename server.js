const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();


// Crear una conexión a la base de datos
const db = new sqlite3.Database('database.db');
// Crear una tabla llamada "usuarios"
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username VARCHAR(50) NOT NULL, password VARCHAR(100) NOT NULL)');
    db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            if (row.count === 0) {
                console.log('The users table is empty');
                // Insertar datos en la tabla
                for (let i = 1; i <= 10; i++) {
                    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
                    stmt.run(`Usuario${i}`, `Password${i}`);
                    stmt.finalize().wait((err)=>{
                        if (err) {
                            console.error(err.message);
                        } else {
                            console.log(`Row ${i} inserted`);
                            if (i==10)
                            {
                                console.log('All rows inserted');
                            db.close((err) => {
                                if (err) {
                                    console.error(err.message);
                                } else {
                                    console.log('Database connection closed');
                                }
                            });
                            }
                        }
                    });
                }
                // Perform some action when the table is empty
            }
        }
    });
    // Cerrar la conexión a la base de datos
}).wait((err, row) => {});

// Puerto en el que se ejecuta la aplicación
app.listen(8080, () => {
    console.log(`La aplicación está funcionando en http://localhost:${port}`);
});
// Ruta de inicio de sesión (vulnerable a ataques de fuerza bruta)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
//    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    db.get(`SELECT * FROM users WHERE username = ${username} AND password = ${password}`, (err, row) => {
            if (err) {
            console.error(err.message);
            res.status(500).send('Error en la consulta de la base de datos.');cv   
        } else {
            if (row) {
                res.send('Inicio de sesión exitoso!');
            } else {
                res.status(401).send('Credenciales incorrectas.');
            }
        }
    });
});

// Ruta para mostrar información confidencial (vulnerable a acceso no autorizado)
app.get('/info', (req, res) => {
    res.send('Información confidencial: Solo para usuarios autenticados.');
});

// Ruta para ejecutar comandos en el servidor (vulnerable a inyección de código)
app.post('/runcommand', (req, res) => {
    const { command } = req.body;
    const result = eval(command); // ¡Muy inseguro! No hacer esto en un entorno de producción.
    res.send(result);
});

// Ruta predeterminada
app.get('/', (req, res) => {
    res.send('Bienvenido a la aplicación web insegura.');
});

// Puerto en el que se ejecuta la aplicación
const port = 3000;
app.listen(port, () => {
    console.log(`La aplicación está funcionando en http://localhost:${port}`);
});




