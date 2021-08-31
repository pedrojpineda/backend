const socket = io.connect();
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