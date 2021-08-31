const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const router = express.Router();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

class Producto {
    constructor(id, title, price, thumbnail) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.thumbnail = thumbnail;
    }
};

const productos = {
    items: []
};
let id = 1;

// WEBSOCKETS

io.on('connection', (socket) => {
    console.log('Cliente conectado');
    socket.emit('productos', productos.items);

    socket.on('item', (data) => {
        data.id = id++
        productos.items.push(data);
        io.sockets.emit('productos', productos.items);
    });
});

// RUTAS

router.post('/productos/guardar', (req, res) => {
    let nuevoProducto = req.body;
    nuevoProducto.id = id++;
    productos.items.push(new Producto(
        nuevoProducto.id,
        nuevoProducto.title,
        nuevoProducto.price,
        nuevoProducto.thumbnail
    ));
    res.redirect('/');
});

router.get('/', (req, res) => {
    res.send('index.html');
});

router.get('/productos/listar', (req, res) => {
    if (productos.items.length > 0) {
        res.send(productos.items);
    } else {
        res.send({ error: 'No hay productos cargados' });
    }
});

router.get('/productos/listar/:id', (req, res) => {
    let producto = productos.items.find(producto => producto.id === Number(req.params.id));
    if (producto) {
        res.send(producto);
    } else {
        res.send({ error: 'Producto no encontrado' });
    }
});

router.put('/productos/actualizar/:id', (req, res) => {
    let producto = productos.items.find(producto => producto.id === Number(req.params.id));
    let index = productos.items.findIndex(producto => producto.id === Number(req.params.id));
    if (producto) {
        producto = req.body;
        producto.id = Number(req.params.id);
        productos.items[index] = producto;
        res.send(producto);
    } else {
        res.send({ error: 'Producto no encontrado' });
    }
});

router.delete('/productos/borrar/:id', (req, res) => {
    let producto = productos.items.find(producto => producto.id === Number(req.params.id));
    let index = productos.items.findIndex(producto => producto.id === Number(req.params.id));
    if (producto) {
        let productoBorrado = productos.items.splice(index, 1);
        res.send(productoBorrado);
    } else {
        res.send({ error: 'Producto no encontrado' });
    }
});

app.use('/api', router);
app.use(express.static(__dirname + '/public'));

const PORT = 8080;

server.listen(PORT, err => {
    if (err) throw new Error(`Error en el servidor ${err}`)
    console.log(`Escuchando en el puerto ${PORT}`);
});