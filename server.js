const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { options } = require('./controllers/sqlite3');
const { knex } = require('../controllers/serverdb')

const routerProductos = express.Router();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let administrador = true;

// RUTAS PRODUCTOS

app.get('/', (req, res) => {
    res.send('Bienvenidos a la tienda online');
});

routerProductos.get('/listar', (req, res) => {
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
});

routerProductos.get('/listar/:id', (req, res) => {
    knex('productos').where({ 'id': req.params.id }).then((data) => res.json(data[0]))
});

routerProductos.post('/agregar', (req, res) => {
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
});

routerProductos.put('/actualizar/:id', (req, res) => {
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
});

routerProductos.delete('/borrar/:id', (req, res) => {
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
app.use(express.static(__dirname + '/public'));

const PORT = 8080;

server.listen(PORT, err => {
    if (err) throw new Error(`Error en el servidor ${err}`)
    console.log(`Escuchando en el puerto ${PORT}`);
});