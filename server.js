const express = require('express');
const app = express();
const server = require('http').Server(app);

const routerProductos = express.Router();
app.use('/productos', routerProductos);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

exports.administrador = true;

const factory = (db) => {
    switch (db) {
        case 0:
            return memoria = require('./databases/0-memoria/memoria');
        case 1:
            return fileSys = require('./databases/1-filesystem/filesystem');
        case 2:
            exports.database = require('./databases/2-MariaDB/conection');
            return mariadb = require('./databases/2-MariaDB/mariadb');
        case 3:
            return mariaDBaaS = require('./databases/2-MariaDB/mariadb');
            // NO SE VIO EN NINGUNA CLASE
        case 4:
            exports.database = require('./databases/4-sqlite3/conection');
            return sqlite3 = require('./databases/2-MariaDB/mariadb');
        case 5:
            exports.URL = 'mongodb://localhost:27017/ecommerce';
            return mongodb = require('./databases/5-mongodb/mongodb');
        case 6:
            exports.URL = 'mongodb+srv://pedropineda:1JebVUaHw6hNjnA5@cluster0.srlg6.mongodb.net/ecommerce?retryWrites=true&w=majority';
            return mongoDBaaS = require('./databases/5-mongodb/mongodb');
        case 7:
            return firebase = require('./databases/6-firebase/firebase');
        default:
            break;
    }
}

const db = factory(0);

app.get('/', (req, res) => {
    res.send('Bienvenidos a la tienda online');
});

// RUTAS PRODUCTOS
routerProductos.get('/listar', db.prodListar)
routerProductos.get('/listar/:id', db.prodListarId)
routerProductos.post('/agregar', db.prodAgregar);
routerProductos.put('/actualizar/:id', db.prodActualizar);
routerProductos.delete('/borrar/:id', db.prodBorrar);

// RUTAS FILTROS
routerProductos.get('/nombre/:nombre', db.prodFiltrarNombre);
routerProductos.get('/codigo/:codigo', db.prodFiltrarCodigo);
routerProductos.get('/precios/:precio1/:precio2', db.prodFiltrarPrecios);
routerProductos.get('/stocks/:stock1/:stock2', db.prodFiltrarStocks);

app.use(express.static(__dirname + '/public'));

const PORT = 8080;

server.listen(PORT, err => {
    if (err) throw new Error(`Error en el servidor ${err}`)
    console.log(`Escuchando en el puerto ${PORT}`);
});