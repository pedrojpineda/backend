const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const router = express.Router();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const fs = require("fs");

// PRODUCTOS
interface Producto {
  items: {
    id: number,
    title: string,
    price: number,
    thumbnail: string
  }
}

const productos: Array<Producto> = [];
let id = 1;

// MENSAJES

interface Chat {
  mensajes: {
    email: string,
    mensaje: string,
    fecha: Date
  }
};

const chat: Array<Chat> = [];;


// WEBSOCKETS

io.on("connection", (socket: any) => {
  console.log("Cliente conectado");

  socket.emit("productos", productos);
  socket.on("item", (data: Producto) => {
    data.items.id = id++;
    productos.push(data);
    io.sockets.emit("productos", productos);
  });

  socket.emit("mensajes", chat);
  socket.on("mensaje", (data: Chat) => {
    data.mensajes.fecha = new Date();
    chat.push(data);
    //fs.writeFileSync('./productos.json', JSON.stringify(chat.mensajes));
    io.sockets.emit("mensajes", chat);
  });
});

// RUTAS

router.post(
  "/productos/guardar",
  (req: { body: any }, res: { redirect: (arg0: string) => void }) => {
    let nuevoProducto = req.body;
    nuevoProducto.id = id++;
    productos.push(
        nuevoProducto.id,
        nuevoProducto.title,
        nuevoProducto.price,
        nuevoProducto.thumbnail
    );
    res.redirect("/");
  }
);

router.get("/", (req: any, res: { send: (arg0: string) => void; }) => {
  res.send("index.html");
});

router.get("/productos/listar", (req: any, res: { send: (arg0: { error: string; }) => void; }) => {
  if (productos.length > 0) {
    res.send(req);
  } else {
    res.send({ error: "No hay productos cargados" });
  }
});

router.get("/productos/listar/:id", (req: { params: { id: any; }; }, res: { send: (arg0: { error: string; }) => void; }) => {
  let producto:any = productos.find(
    (producto) => producto.items.id === Number(req.params.id)
  );
  if (producto) {
    res.send(producto);
  } else {
    res.send({ error: "Producto no encontrado" });
  }
});

router.put("/productos/actualizar/:id", (req: { params: { id: any; }; body: any; }, res: { send: (arg0: { error: string; }) => void; }) => {
  let producto:any = productos.find(
    (producto) => producto.items.id === Number(req.params.id)
  );
  let index = productos.findIndex(
    (producto) => producto.items.id === Number(req.params.id)
  );
  if (producto) {
    producto = req.body;
    producto.id = Number(req.params.id);
    productos[index] = producto;
    res.send(producto);
  } else {
    res.send({ error: "Producto no encontrado" });
  }
});

router.delete("/productos/borrar/:id", (req: { params: { id: any; }; }, res: { send: (arg0: { error: string; }) => void; }) => {
  let producto:any = productos.find(
    (producto) => producto.items.id === Number(req.params.id)
  );
  let index = productos.findIndex(
    (producto) => producto.items.id === Number(req.params.id)
  );
  if (producto) {
    let productoBorrado: any = productos.splice(index, 1);
    res.send(productoBorrado);
  } else {
    res.send({ error: "Producto no encontrado" });
  }
});

app.use("/api", router);
app.use(express.static(__dirname + "/public"));

const PORT = 8080;

server.listen(PORT, (err: any) => {
  if (err) throw new Error(`Error en el servidor ${err}`);
  console.log(`Escuchando en el puerto ${PORT}`);
});
