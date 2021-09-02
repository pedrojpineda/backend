const socket = io.connect();

// PRODUCTOS
const my_template = document.getElementById('template');
const to_render = document.getElementById('to_render');

socket.on('productos', data => {
    console.log(data);
    const template = ejs.compile(my_template.innerHTML);
    to_render.innerHTML = template({ items: data })
})

function addProducto() {
    let item = {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        thumbnail: document.getElementById('thumbnail').value
    };
    socket.emit('item', item);
    return false;
};

// CHAT
const my_chat = document.getElementById('chat');
const chat_render = document.getElementById('chat_render');

socket.on('mensajes', data => {
    console.log(data);
    const chat = ejs.compile(my_chat.innerHTML);
    chat_render.innerHTML = chat({ mensajes: data })
})

function addMensaje() {
    let mensaje = {
        email: document.getElementById('email').value,
        mensaje: document.getElementById('mensaje').value,
    };
    socket.emit('mensaje', mensaje);
    return false;
};
