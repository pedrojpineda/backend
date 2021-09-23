const dbMaria = require('./mariadb');
const knex = require('knex')(dbMaria);
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db/db.sqlite', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

db.serialize(() => {
    db.each(`CREATE TABLE "mensajes"
    (
        [Id] INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        [name] NVARCHAR(160)  NOT NULL,
        [mensaje] NVARCHAR(160) NOT NULL,
        FOREIGN KEY ([Id]) REFERENCES "ID" ([Id])
        ON DELETE NO ACTION ON UPDATE NO ACTION
    );`, (err) => {
        if (err) {
            console.error(err.message);
        }
    });
});
db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Close the database connection.');
});

knex.schema.hasTable("productos").then(exist => {
    if (!exist) {
        return knex.schema.createTable('productos', (table) => {
            table.increments("id").primary();
            table.datetime("timestamp", { precision: 6 }).defaultTo(knex.fn.now(6));
            table.string("nombre", 100).notNullable();
            table.string("descripcion", 250);
            table.integer("codigo").notNullable();
            table.string("foto", 255);
            table.integer("precio").notNullable();
            table.integer("stock").notNullable();
        }).then(
            (console.log('tabla creada'),
                (err) => console.log(err),
                () => knex.destroy())
        );
    };
});

module.exports = { knex, dbMaria }