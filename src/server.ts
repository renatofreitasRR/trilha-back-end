import fastify from 'fastify'
import { usersRoutes } from './routes/users';
import { env } from './env';
import { imagesRoutes } from './routes/images';
/* import { usuarioImagensRoutes } from './routes/usuario-imagem'; */
import { temasRoutes } from './routes/temas';
import { iconeRoutes } from './routes/icone';
import { pecaRoutes } from './routes/peca';
<<<<<<< HEAD
import cors from '@fastify/cors'
=======
import { usuarioTemaRoutes } from './routes/usuario-tema';
>>>>>>> 983db94cefd5cbffb3e271cac523ff83946babe0

const app = fastify()

app.register(cors, {
    origin: "*",
    methods: ['GET', 'PUT', 'POST', 'DELETE']
})

const PORT = env.PORT;

app.register(usersRoutes, {
    prefix: 'usuarios'
});

app.register(imagesRoutes, {
    prefix: 'imagens'
});

app.register(temasRoutes, {
    prefix: 'temas'
});

app.register(iconeRoutes, {
    prefix: 'icones'
});

app.register(pecaRoutes, {
    prefix: 'pecas'
});

app.register(usuarioTemaRoutes, {
    prefix: 'usuario-tema'
});

app.listen({
    host: '0.0.0.0',
    port: PORT,
})
    .then(() => {
        console.log(`Running on port http://localhost:${PORT}`)
    })
    .catch((err) => {
        console.log("Error", err);
    });