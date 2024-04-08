import fastify from 'fastify'
import { knex } from './database';
import { usersRoutes } from './routes/users';

const app = fastify()
const PORT = 3333;

app.register(usersRoutes, {
    prefix: 'usuarios'
});

app.get('/', () => {
    return 'Running'
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