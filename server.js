const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

class Producto {
    constructor(id, title, price, thumbnail) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.thumbnail = thumbnail;
    }
}

const productos = [];
let id = 1;

app.get('/api/productos/listar', (req, res) => {
    if(productos.length > 0) {
        res.send(productos);
    } else {
        res.send({error: 'no hay productos cargados'});
    }
});

app.get('/api/productos/listar/:id', (req, res) => {
    let producto = productos.find(producto => producto.id === Number(req.params.id));
    if(producto) {
        res.send(producto);
    } else {
        res.send({error: 'producto no encontrado'});
    }
});

app.post('/api/productos/guardar', (req, res) => {
    let nuevoProducto = req.body;
    nuevoProducto.id = id++;
    productos.push(new Producto(
        nuevoProducto.id,
        nuevoProducto.title,
        nuevoProducto.price,
        nuevoProducto.thumbnail
    ));
    res.send(nuevoProducto);
});

const server = app.listen(8080, () => {
    console.log('Escuchando en el puerto 8080');
});