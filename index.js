const mongoose = require('mongoose');


const URL = 'mongodb://localhost:27017/ecommerce'
async function CRUD() {
    await mongoose.connect('mongodb://localhost:27017/test');
}