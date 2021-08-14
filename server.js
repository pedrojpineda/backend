const express = require('express');
const app = express();
const router = express.Router();

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

router.get('/productos/listar', (req, res) => {
    if(productos.length > 0) {
        res.send(productos);
    } else {
        res.send({error: 'no hay productos cargados'});
    }
});

router.get('/productos/listar/:id', (req, res) => {
    let producto = productos.find(producto => producto.id === Number(req.params.id));
    if(producto) {
        res.send(producto);
    } else {
        res.send({error: 'producto no encontrado'});
    }
});

router.post('/productos/guardar', (req, res) => {
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

router.put('/productos/actualizar/:id', (req, res) => {
    let producto = productos.find(producto => producto.id === Number(req.params.id));
    let index = productos.findIndex(producto => producto.id === Number(req.params.id));
    if(producto) {
        producto = req.body;
        producto.id = Number(req.params.id);
        productos[index] = producto;
        res.send(producto);
    } else {
        res.send({error: 'producto no encontrado'});
    }
});

router.delete('/productos/borrar/:id', (req, res) => {
    let producto = productos.find(producto => producto.id === Number(req.params.id));
    let index = productos.findIndex(producto => producto.id === Number(req.params.id));
    if(producto) {
        let productoBorrado = productos.splice(index, 1);
        res.send(productoBorrado);
    } else {
        res.send({error: 'producto no encontrado'});
    }
});

app.use('/api', router);
app.use(express.static('public'));

const server = app.listen(8080, () => {
    console.log('Escuchando en el puerto 8080');
});