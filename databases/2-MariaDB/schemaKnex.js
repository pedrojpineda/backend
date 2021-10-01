const { database } = require('../../server');
const knex = require('knex')(database);

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

module.exports = { knex, database }