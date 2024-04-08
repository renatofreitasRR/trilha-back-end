import fastify from 'fastify'
import { usersRoutes } from './routes/users';
import { env } from './env';

const app = fastify()
const PORT = env.PORT;

app.register(usersRoutes, {
    prefix: 'usuarios'
});

app.get('/', () => {
    return 'Running'
});

app.listen({
    host: '0.0.0.0',
    port: PORT
})
    .then(() => {
        console.log(`Running on port http://localhost:${PORT}`)
    })
    .catch((err) => {
        console.log("Error", err);
    });