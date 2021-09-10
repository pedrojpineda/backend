const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');

const routerProductos = express.Router();
const routerCarrito = express.Router();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

class Producto {
    constructor(id, timestamp, nombre, descripcion, codigo, foto, precio, stock) {
        this.id = id;
        this.timestamp = timestamp;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.codigo = codigo;
        this.foto = foto;
        this.precio = precio;
        this.stock = stock;
    }
};

const productos = JSON.parse(fs.readFileSync('./productos.json', 'utf-8'));
let id = productos.length + 1;

class ItemCarrito {
    constructor(id, timestamp, producto) {
        this.id = id;
        this.timestamp = timestamp;
        this.producto = producto;
    }
};

let administrador = true;

// RUTAS PRODUCTOS

app.get('/', (req, res) => {
    res.send('Bienvenidos a la tienda online');
});

routerProductos.get('/listar', (req, res) => {
    if (productos.length > 0) {
        res.send(productos);
    } else {
        res.send({ error: 'No hay productos cargados' });
    }
});

routerProductos.get('/listar/:id', (req, res) => {
    let producto = productos.find(producto => producto.id === Number(req.params.id));
    if (producto) {
        res.send(producto);
    } else {
        res.send({ error: 'Producto no encontrado' });
    }
});

routerProductos.post('/agregar', (req, res) => {
    if (administrador) {
        let nuevoProducto = req.body;
        nuevoProducto.id = id++;
        nuevoProducto.timestamp = Date.now();
        productos.push(new Producto(
            nuevoProducto.id,
            nuevoProducto.timestamp,
            nuevoProducto.nombre,
            nuevoProducto.descripcion,
            nuevoProducto.codigo,
            nuevoProducto.foto,
            nuevoProducto.precio,
            nuevoProducto.stock,
        ));
        res.send(nuevoProducto.nombre + ' agregado al inventario');
        fs.writeFileSync('./productos.json', JSON.stringify(productos));
    } else {
        res.send({ error: -1, descripcion: 'Ruta /agregar con método post no autorizada' });
    }
});

routerProductos.put('/actualizar/:id', (req, res) => {
    if (administrador) {
        let producto = productos.find(producto => producto.id === Number(req.params.id));
        let index = productos.findIndex(producto => producto.id === Number(req.params.id));
        if (producto) {
            producto = req.body;
            producto.id = Number(req.params.id);
            productos[index] = producto;
            res.send(producto.nombre + ' actualizado en el inventario');
            fs.writeFileSync('./productos.json', JSON.stringify(productos));
        } else {
            res.send({ error: 'Producto no encontrado' });
        }
    } else {
        res.send({ error: -1, descripcion: 'Ruta /actualizar con método put no autorizada' });
    }
});

routerProductos.delete('/borrar/:id', (req, res) => {
    if (administrador) {
        let producto = productos.find(producto => producto.id === Number(req.params.id));
        let index = productos.findIndex(producto => producto.id === Number(req.params.id));
        if (producto) {
            let productoBorrado = productos.splice(index, 1);
            res.send(productoBorrado);
            fs.writeFileSync('./productos.json', JSON.stringify(productos));
        } else {
            res.send({ error: 'Producto no encontrado' });
        }
    } else {
        res.send({ error: -1, descripcion: 'Ruta /borrar con método delete no autorizada' });
    }
});

// RUTAS CARRITO

const carrito = JSON.parse(fs.readFileSync('./carrito.json', 'utf-8'));;

let idCarrito = carrito.length + 1;

routerCarrito.get('/listar', (req, res) => {
    if (carrito.length > 0) {
        res.send(carrito);
    } else {
        res.send({ error: 'No hay productos en el carrito' });
    }
});

routerCarrito.get('/listar/:id', (req, res) => {
    let producto = carrito.find(producto => producto.id === Number(req.params.id));
    if (producto) {
        res.send(producto);
    } else {
        res.send({ error: 'Producto no encontrado en el carrito' });
    }
});

routerCarrito.post('/agregar/:id', (req, res) => {
    let producto = productos.find(producto => producto.id === Number(req.params.id));
    if (producto) {
        let agregarProducto = {};
        agregarProducto.id = idCarrito++;
        agregarProducto.timestamp = Date.now();
        agregarProducto.producto = producto;
        carrito.push(new ItemCarrito(
            agregarProducto.id,
            agregarProducto.timestamp,
            agregarProducto.producto
        ));
        res.send(producto.nombre + ' agregado al carrito');
        fs.writeFileSync('./carrito.json', JSON.stringify(carrito));
    } else {
        res.send({ error: 'Producto no encontrado en el inventario' });
    }
});

routerCarrito.delete('/borrar/:id', (req, res) => {
    let producto = carrito.find(producto => producto.id === Number(req.params.id));
    let index = carrito.findIndex(producto => producto.id === Number(req.params.id));
    if (producto) {
        let productoBorrado = carrito.splice(index, 1);
        res.send(productoBorrado);
        fs.writeFileSync('./carrito.json', JSON.stringify(carrito));
    } else {
        res.send({ error: 'Producto no encontrado en el carrito' });
    }
});

// WEBSOCKETS

io.on('connection', (socket) => {
    console.log('Cliente conectado');
    socket.emit('productos', productos);

    socket.on('item', (data) => {
        data.id = id++
        productos.push(data);
        io.sockets.emit('productos', productos);
    });
});


app.use('/productos', routerProductos);
app.use('/carrito', routerCarrito);
app.use(express.static(__dirname + '/public'));

const PORT = 8080;

server.listen(PORT, err => {
    if (err) throw new Error(`Error en el servidor ${err}`)
    console.log(`Escuchando en el puerto ${PORT}`);
});