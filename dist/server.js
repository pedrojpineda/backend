'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var router = express.Router();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var fs = require('fs');

// PRODUCTOS

var Producto = function Producto(id, title, price, thumbnail) {
    _classCallCheck(this, Producto);

    this.id = id;
    this.title = title;
    this.price = price;
    this.thumbnail = thumbnail;
};

;

var productos = {
    items: []
};
var id = 1;

// MENSAJES

var chat = {
    mensajes: []
};

// WEBSOCKETS

io.on('connection', function (socket) {
    console.log('Cliente conectado');

    socket.emit('productos', productos.items);
    socket.on('item', function (data) {
        data.id = id++;
        productos.items.push(data);
        io.sockets.emit('productos', productos.items);
    });

    socket.emit('mensajes', chat.mensajes);
    socket.on('mensaje', function (data) {
        data.fecha = new Date();
        chat.mensajes.push(data);
        //fs.writeFileSync('./productos.json', JSON.stringify(chat.mensajes));
        io.sockets.emit('mensajes', chat.mensajes);
    });
});

// RUTAS

router.post('/productos/guardar', function (req, res) {
    var nuevoProducto = req.body;
    nuevoProducto.id = id++;
    productos.items.push(new Producto(nuevoProducto.id, nuevoProducto.title, nuevoProducto.price, nuevoProducto.thumbnail));
    res.redirect('/');
});

router.get('/', function (req, res) {
    res.send('index.html');
});

router.get('/productos/listar', function (req, res) {
    if (productos.items.length > 0) {
        res.send(productos.items);
    } else {
        res.send({ error: 'No hay productos cargados' });
    }
});

router.get('/productos/listar/:id', function (req, res) {
    var producto = productos.items.find(function (producto) {
        return producto.id === Number(req.params.id);
    });
    if (producto) {
        res.send(producto);
    } else {
        res.send({ error: 'Producto no encontrado' });
    }
});

router.put('/productos/actualizar/:id', function (req, res) {
    var producto = productos.items.find(function (producto) {
        return producto.id === Number(req.params.id);
    });
    var index = productos.items.findIndex(function (producto) {
        return producto.id === Number(req.params.id);
    });
    if (producto) {
        producto = req.body;
        producto.id = Number(req.params.id);
        productos.items[index] = producto;
        res.send(producto);
    } else {
        res.send({ error: 'Producto no encontrado' });
    }
});

router.delete('/productos/borrar/:id', function (req, res) {
    var producto = productos.items.find(function (producto) {
        return producto.id === Number(req.params.id);
    });
    var index = productos.items.findIndex(function (producto) {
        return producto.id === Number(req.params.id);
    });
    if (producto) {
        var productoBorrado = productos.items.splice(index, 1);
        res.send(productoBorrado);
    } else {
        res.send({ error: 'Producto no encontrado' });
    }
});

app.use('/api', router);
app.use(express.static(__dirname + '/public'));

var PORT = 8080;

server.listen(PORT, function (err) {
    if (err) throw new Error('Error en el servidor ' + err);
    console.log('Escuchando en el puerto ' + PORT);
});
