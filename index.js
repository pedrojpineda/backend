const express = require('express');
const { send } = require('process');
const fs = require('fs');

const app = express();
const server = app.listen(8080, () => {
    console.log('Escuchando en el puerto 8080')
});

const archivo = fs.readFileSync('./productos.txt', 'utf-8');
const productos = JSON.parse(archivo);

const rand = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};

let visitasItems = 0;
let visitasItem = 0;

app.get('/', (req, res) => {
    res.send(`
        <ol>
            <li><a href="/items">/items</a></li>
            <li><a href="/item-random">/item-random</a></li>
            <li><a href="/visitas">/visitas</a></li>
        </ol>`);
});

app.get('/items', (req, res) => {
    try {
        visitasItems++;
        res.send([{ items: productos }, { cantidad: productos.length }]);
    } catch (error) {
        console.log('Error obteniendo items', error);
    }
});

app.get('/item-random', (req, res) => {
    try {
        visitasItem++;
        res.send({ item: productos[rand(0, productos.length - 1)]});
    } catch (error) {
        console.log('Error obteniendo item', error);
    }
});

app.get('/visitas', (req, res) => {
    try {
        res.send({ visitas: { items: visitasItems, item: visitasItem } });
    } catch (error) {
        console.log('Error obteniendo visitas', error);
    }
    
});
