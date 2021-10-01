const fs = require('fs');
const { administrador } = require('../../server');

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

// CRUD

exports.prodListar = (req, res) => {
    if (productos.length > 0) {
        res.send(productos);
    } else {
        res.send({ error: 'No hay productos cargados' });
    }
};

exports.prodListarId = (req, res) => {
    let producto = productos.find(producto => producto.id === Number(req.params.id));
    if (producto) {
        res.send(producto);
    } else {
        res.send({ error: 'Producto no encontrado' });
    }
};

exports.prodAgregar = (req, res) => {
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
};

exports.prodActualizar = (req, res) => {
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
};

exports.prodBorrar = (req, res) => {
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
};


// FILTROS

exports.prodFiltrarNombre = async (req, res) => {
    let producto = productos.find(producto => producto.nombre === req.params.nombre);
    if (producto) {
        res.send(producto);
    } else {
        res.send({ error: 'Producto no encontrado' });
    }
}

exports.prodFiltrarCodigo = async (req, res) => {
    let producto = productos.find(producto => producto.codigo === req.params.codigo);
    if (producto) {
        res.send(producto);
    } else {
        res.send({ error: 'Producto no encontrado' });
    }
}

exports.prodFiltrarPrecios = async (req, res) => {
    let items = productos.filter(producto => producto.precio >= Number(req.params.precio1) && item.data().precio <= Number(req.params.precio2));
    if (items) {
        res.send(items);
    } else {
        res.send({ error: 'No hay porductos con ese rango de precios' });
    }
}

exports.prodFiltrarStocks = async (req, res) => {
    let items = productos.filter(producto => producto.stock >= Number(req.params.stock1) && item.data().precio <= Number(req.params.stock2));
    if (items) {
        res.send(items);
    } else {
        res.send({ error: 'No hay porductos con ese rango de stock' });
    }
} 