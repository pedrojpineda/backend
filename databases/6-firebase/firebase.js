const admin = require("firebase-admin");

var serviceAccount = require("./firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const { administrador } = require('../../server');
const db = admin.firestore();
const query = db.collection('productos');


// CRUD

exports.prodListar = async (req, res) => {
    try {
        const querySnapshot = await query.get();
        let docs = querySnapshot.docs;
        const productos = docs.map((producto) => (producto.data()));
        res.send(productos);
    } catch (error) {
        console.log(error)
        res.json(error);
    }
}

exports.prodListarId = async (req, res) => {
    try {
        const doc = query.doc(req.params.id);
        const item = await doc.get();
        const producto = item.data();
        res.send(producto);
    } catch (error) {
        console.log(error)
    }
}

exports.prodAgregar = async (req, res) => {
    if (administrador) {
        try {
            let nuevoProducto = req.body;
            nuevoProducto.timestamp = Date.now();
            const doc = query.doc();
            await doc.create(nuevoProducto);
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
            const doc = query.doc(req.params.id);
            let producto = req.body;
            await doc.update(producto);
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
            const doc = query.doc(req.params.id);
            const item = await doc.get();
            const producto = item.data();
            await doc.delete();
            res.send(producto.nombre + ' eliminado del inventario');
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
        const querySnapshot = await query.get();
        let docs = querySnapshot.docs;
        const producto = docs.find(item => item.data().nombre === req.params.nombre);
        res.send(producto.data());
    } catch (error) {
        console.log(error)
        res.json(error);
    }
}

exports.prodFiltrarCodigo = async (req, res) => {
    try {
        const querySnapshot = await query.get();
        let docs = querySnapshot.docs;
        const producto = docs.find(item => item.data().codigo === req.params.codigo);
        res.send(producto.data());
    } catch (error) {
        console.log(error)
        res.json(error);
    }
}

exports.prodFiltrarPrecios = async (req, res) => {
    try {
        const querySnapshot = await query.get();
        let docs = querySnapshot.docs;
        const productos = docs.filter(item => item.data().precio >= req.params.precio1 && item.data().precio <= req.params.precio2);
        res.send(productos.data());
    } catch (error) {
        console.log(error)
        res.json(error);
    }
}

exports.prodFiltrarStocks = async (req, res) => {
    try {
        const querySnapshot = await query.get();
        let docs = querySnapshot.docs;
        const productos = docs.filter(item => item.data().stock >= req.params.stock1 && item.data().precio <= req.params.stock2);
        res.send(productos.data());
    } catch (error) {
        console.log(error)
        res.json(error);
    }
} 