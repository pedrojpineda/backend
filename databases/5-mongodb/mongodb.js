const mongoose = require('mongoose');
const productoModel = require("./schemas/productos");
const { administrador, URL } = require('../../server');

const ConnectionToDatabase = async () => {
    try {
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Base de datos conectada");
    } catch (error) {
        console.log(error);
    }
};
 
// CRUD

exports.prodListar = async (req, res) => {
    try {
        const productos = await productoModel.find({});
        res.send(productos);
    } catch (error) {
        console.log(error)
        res.json(error);
    }
}

exports.prodListarId = async (req, res) => {
    try {
        const producto = await productoModel.findById(req.params.id)
        res.send(producto);
    } catch (error) {
        console.log(error)
    }
}

exports.prodAgregar = async (req, res) => {
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
}

exports.prodActualizar = async (req, res) => {
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
}

exports.prodBorrar = async (req, res) => {
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
}

// FILTROS

exports.prodFiltrarNombre = async (req, res) => {
    try {
        const producto = await productoModel.findOne({"nombre": req.params.nombre});
        res.send(producto);
    } catch (error) {
        console.log(error)
    }
}

exports.prodFiltrarCodigo = async (req, res) => {
    try {
        const producto = await productoModel.findOne({"codigo": req.params.codigo});
        res.send(producto);
    } catch (error) {
        console.log(error)
    }
}

exports.prodFiltrarPrecios = async (req, res) => {
    try {
        const productos = await productoModel.find({"precio": {$gte: req.params.precio1, $lte: req.params.precio2}});
        res.send(productos);
    } catch (error) {
        console.log(error)
        res.json(error);
    }
}

exports.prodFiltrarStocks = async (req, res) => {
    try {
        const productos = await productoModel.find({"stock": {$gte: req.params.stock1, $lte: req.params.stock2}});
        res.send(productos);
    } catch (error) {
        console.log(error)
        res.json(error);
    }
}

ConnectionToDatabase();