import fastify from 'fastify'
import { knex } from './database';


const app = fastify()

const PORT = 3333;

app.get('/', () => {
    return 'Running'
});

app.get('/db', async () => {
    const tables = await knex('sqlite_schema').select('*')

    console.log("TABLES", tables);

    return tables
});

app.get('/hello', () => {
    return 'Hello World'
});

app.listen({
    port: PORT
})
    .then(() => {
        console.log(`Running on port http://localhost:${PORT}`)
    })
    .catch((err) => {
        console.log("Error", err);
    });