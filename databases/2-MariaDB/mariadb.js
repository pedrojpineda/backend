const { knex } = require('./schemaKnex')
const { administrador } = require('../../server');

//  CRUD

exports.prodListar = (req, res) => {
    try {
        knex("productos").select("*").then((data) => {
            if (data > 0) {
                res.send(data)
            } else {
                res.send("No existen productos disponibles")
            }
        });
    } catch (err) {
        console.error(err);
    }
};

exports.prodListarId = (req, res) => {
    try {
        knex('productos').where({ 'id': req.params.id }).then((data) => res.json(data[0]))
    }
    catch (err) {
        console.error(err);
    }
};

exports.prodAgregar = (req, res) => {
    if (administrador) {
        try {
            let nuevoProducto = req.body;
            nuevoProducto.timestamp = Date.now();
            knex('productos').insert({
                timestamp: nuevoProducto.timestamp,
                nombre: nuevoProducto.nombre,
                descripcion: nuevoProducto.descripcion,
                codigo: parseInt(nuevoProducto.codigo),
                foto: nuevoProducto.foto,
                precio: parseInt(nuevoProducto.precio),
                stock: parseInt(nuevoProducto.stock),
            }).then(id => knex('productos').where({ 'id': id[0] }).then((data) => res.json(data[0])))
        } catch (err) {
            res.status(404).json(err)
        }
    } else {
        res.send({ error: -1, descripcion: 'Ruta /agregar con método post no autorizada' });
    }
};

exports.prodActualizar = (req, res) => {
    if (administrador) {
        try {
            let id = parseInt(req.params.id)
            knex('productos').where({ id: id }).update(req.query).then((data) => res.json(data[0]))
        } catch (err) {
            console.error(err)
        }
    } else {
        res.send({ error: -1, descripcion: 'Ruta /actualizar con método put no autorizada' });
    }
};

exports.prodBorrar = (req, res) => {
    if (administrador) {
        try {
            let id = parseInt(req.params.id)
            knex("productos").where({ "id": id }).then(data => {
                if (data.length > 0) {
                    knex('productos').where({ id: id })
                        .del().then(() => res.json("Producto eliminado con éxito"))
                } else {
                    res.json({ msg: "El producto con el id " + id + " no existe" })
                }
            })
        } catch (err) {
            console.error(err)
            res.status(400).json("Ha ocurrido un error")
        }
    } else {
        res.send({ error: -1, descripcion: 'Ruta /borrar con método delete no autorizada' });
    }
};

// FILTROS

exports.prodFiltrarNombre = (req, res) => {
    try {
        knex('productos').where({ 'nombre': req.params.nombre }).then((data) => res.json(data[0]))
    }
    catch (err) {
        console.error(err);
    }
};

exports.prodFiltrarCodigo = (req, res) => {
    try {
        knex('productos').where({ 'codigo': req.params.codigo }).then((data) => res.json(data[0]))
    }
    catch (err) {
        console.error(err);
    }
};

exports.prodFiltrarPrecios = (req, res) => {
    try {
        knex('productos').whereBetween('precio', [req.params.precio1, req.params.precio2,]).then((data) => res.json(data[0]))
    }
    catch (err) {
        console.error(err);
    }
};

exports.prodFiltrarStocks = (req, res) => {
    try {
        knex('productos').whereBetween('stocks', [req.params.stock1, req.params.stock2,]).then((data) => res.json(data[0]))
    }
    catch (err) {
        console.error(err);
    }
};