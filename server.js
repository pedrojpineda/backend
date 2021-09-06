"use strict";
var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var router = express.Router();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var fs = require("fs");
var productos = [];
var id = 1;
;
var chat = [];
;
// WEBSOCKETS
io.on("connection", function (socket) {
    console.log("Cliente conectado");
    socket.emit("productos", productos);
    socket.on("item", function (data) {
        data.items.id = id++;
        productos.push(data);
        io.sockets.emit("productos", productos);
    });
    socket.emit("mensajes", chat);
    socket.on("mensaje", function (data) {
        data.mensajes.fecha = new Date();
        chat.push(data);
        //fs.writeFileSync('./productos.json', JSON.stringify(chat.mensajes));
        io.sockets.emit("mensajes", chat);
    });
});
// RUTAS
router.post("/productos/guardar", function (req, res) {
    var nuevoProducto = req.body;
    nuevoProducto.id = id++;
    productos.push(nuevoProducto.id, nuevoProducto.title, nuevoProducto.price, nuevoProducto.thumbnail);
    res.redirect("/");
});
router.get("/", function (req, res) {
    res.send("index.html");
});
router.get("/productos/listar", function (req, res) {
    if (productos.length > 0) {
        res.send(req);
    }
    else {
        res.send({ error: "No hay productos cargados" });
    }
});
router.get("/productos/listar/:id", function (req, res) {
    var producto = productos.find(function (producto) { return producto.items.id === Number(req.params.id); });
    if (producto) {
        res.send(producto);
    }
    else {
        res.send({ error: "Producto no encontrado" });
    }
});
router.put("/productos/actualizar/:id", function (req, res) {
    var producto = productos.find(function (producto) { return producto.items.id === Number(req.params.id); });
    var index = productos.findIndex(function (producto) { return producto.items.id === Number(req.params.id); });
    if (producto) {
        producto = req.body;
        producto.id = Number(req.params.id);
        productos[index] = producto;
        res.send(producto);
    }
    else {
        res.send({ error: "Producto no encontrado" });
    }
});
router.delete("/productos/borrar/:id", function (req, res) {
    var producto = productos.find(function (producto) { return producto.items.id === Number(req.params.id); });
    var index = productos.findIndex(function (producto) { return producto.items.id === Number(req.params.id); });
    if (producto) {
        var productoBorrado = productos.splice(index, 1);
        res.send(productoBorrado);
    }
    else {
        res.send({ error: "Producto no encontrado" });
    }
});
app.use("/api", router);
app.use(express.static(__dirname + "/public"));
var PORT = 8080;
server.listen(PORT, function (err) {
    if (err)
        throw new Error("Error en el servidor " + err);
    console.log("Escuchando en el puerto " + PORT);
});
