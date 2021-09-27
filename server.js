const express = require('express');
const app = express();
const server = require('http').Server(app);
const mongoose = require('mongoose');
const productoModel = require("./schemas/productos.js");
const mensajeModel = require("./schemas/mensajes.js");

const routerProductos = express.Router();
const routerMensajes = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const URL = 'mongodb://localhost:27017/ecommerce'

const ConnectionToDatabase = async () => {
    try {
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Base de datos conectada");
    } catch (error) {
        throw new Error();
    }
};
 
let administrador = true;

// RUTAS PRODUCTOS

app.get('/', (req, res) => {
    res.send('Bienvenidos a la tienda online');
});

routerProductos.get('/listar', async (req, res) => {
    try {
        const productos = await productoModel.find({});
        res.send(productos);
    } catch (error) {
        console.log(error)
        res.json(error);
    }
});

routerProductos.get('/listar/:id', async (req, res) => {
    try {
        const producto = await productoModel.findById(req.params.id)
        res.send(producto);
    } catch (error) {
        console.log(error)
    }
});

routerProductos.post('/agregar', async (req, res) => {
    if (administrador) {
        try {
            let nuevoProducto = new productoModel(req.body);
            await nuevoProducto.save();
            res.send(nuevoProducto.nombre + ' agregado al inventario');
        } catch (err) {
            res.status(404).json(err)
        }
    } else {
        res.send({ error: -1, descripcion: 'Ruta /agregar con método post no autorizada' });
    }
});

routerProductos.put('/actualizar/:id', async (req, res) => {
    if (administrador) {
        try {
            let producto = await productoModel.findByIdAndUpdate(req.params.id, req.body);
            res.send(producto.nombre + ' actualizado en el inventario');
        } catch (err) {
            res.status(404).json(err)
        }
    } else {
        res.send({ error: -1, descripcion: 'Ruta /actualizar con método put no autorizada' });
    }
});

routerProductos.delete('/borrar/:id', async (req, res) => {
    if (administrador) {
        try {
        let producto = await productoModel.findByIdAndDelete(req.params.id);
        res.send(producto);
    } catch (err) {
        res.status(404).json(err)
    }
    } else {
        res.send({ error: -1, descripcion: 'Ruta /borrar con método delete no autorizada' });
    }
});

// RUTAS MENSAJES

routerMensajes.get('/listar', async (req, res) => {
    try {
        const mensajes = await mensajeModel.find({});
        res.send(mensajes);
    } catch (error) {
        console.log(error)
        res.json(error);
    }
});

routerMensajes.get('/listar/:id', async (req, res) => {
    try {
        const mensaje = await mensajeModel.findById(req.params.id)
        res.send(mensaje);
    } catch (error) {
        console.log(error)
    }
});

routerMensajes.post('/agregar', async (req, res) => {
        try {
            let nuevoMensaje = new mensajeModel(req.body);
            await nuevoMensaje.save();
            res.send(nuevoMensaje);
        } catch (err) {
            res.status(404).json(err)
        }
});

routerMensajes.put('/actualizar/:id', async (req, res) => {
        try {
            let mensaje = await mensajeModel.findByIdAndUpdate(req.params.id, req.body);
            res.send(mensaje);
        } catch (err) {
            res.status(404).json(err)
        }
});

routerMensajes.delete('/borrar/:id', async (req, res) => {
        try {
        let mensaje = await mensajeModel.findByIdAndDelete(req.params.id);
        res.send(mensaje);
    } catch (err) {
        res.status(404).json(err)
    }
});


app.use('/productos', routerProductos);
app.use('/mensajes', routerMensajes);

app.use(express.static(__dirname + '/public'));

const PORT = 8080;

ConnectionToDatabase();

server.listen(PORT, err => {
    if (err) throw new Error(`Error en el servidor ${err}`)
    console.log(`Escuchando en el puerto ${PORT}`);
});