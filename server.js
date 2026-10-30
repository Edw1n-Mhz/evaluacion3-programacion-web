const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Servir la carpeta public y procesar peticiones JSON
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('./taller.db', (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('Conectado exitosamente a la base de datos SQLite.');
    }
});

// Crear tablas si no existen
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        rut TEXT NOT NULL,
        email TEXT NOT NULL,
        telefono TEXT NOT NULL,
        direccion TEXT NOT NULL,
        fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS vehiculos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patente TEXT NOT NULL,
        marca TEXT NOT NULL,
        modelo TEXT NOT NULL,
        anio INTEGER NOT NULL,
        falla TEXT NOT NULL,
        fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// Endpoint 1: Registrar Cliente
app.post('/api/clientes', (req, res) => {
    const { nombre, rut, email, telefono, direccion } = req.body;

    if (!nombre || !rut || !email || !telefono || !direccion) {
        return res.status(400).json({ status: 'error', message: 'Todos los campos son obligatorios.' });
    }

    const sql = `INSERT INTO clientes (nombre, rut, email, telefono, direccion) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [nombre, rut, email, telefono, direccion], function(err) {
        if (err) {
            return res.status(500).json({ status: 'error', message: 'Error al registrar el cliente en la base de datos.' });
        }
        res.status(200).json({ status: 'success', message: '¡Cliente registrado con éxito en el sistema!' });
    });
});

// Endpoint 2: Registrar Vehículo
app.post('/api/vehiculos', (req, res) => {
    const { patente, marca, modelo, anio, falla } = req.body;

    if (!patente || !marca || !modelo || !anio || !falla) {
        return res.status(400).json({ status: 'error', message: 'Todos los campos son obligatorios.' });
    }

    const sql = `INSERT INTO vehiculos (patente, marca, modelo, anio, falla) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [patente, marca, modelo, anio, falla], function(err) {
        if (err) {
            return res.status(500).json({ status: 'error', message: 'Error al registrar el vehículo en la base de datos.' });
        }
        res.status(200).json({ status: 'success', message: '¡Vehículo ingresado al taller con éxito!' });
    });
});

// Arrancar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});