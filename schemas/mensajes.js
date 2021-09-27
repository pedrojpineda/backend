const {Schema, model} = require('mongoose')

const mensajeSchema = new Schema(
    {
        timestamp: {type: Date, default: Date.now},
        nombre: {type: String, require: true},
        mensaje: {type: String, require: true},
    }, { collection: 'mensajes' });

module.exports = model('Mensaje', mensajeSchema);
