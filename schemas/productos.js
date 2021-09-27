const {Schema, model} = require('mongoose')

const productoSchema = new Schema(
    {
        timestamp: {type: Date, default: Date.now},
        nombre: {type: String, require: true},
        descripcion: {type: String, require: true},
        codigo: {type: String, require: true},
        foto: {type: String, require: true},
        precio: {type: Number, require: true},
        stock: {type: Number, require: true},
    }, { collection: 'productos' });

module.exports = model('Producto', productoSchema);