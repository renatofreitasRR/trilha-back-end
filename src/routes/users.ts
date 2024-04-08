import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { knex } from "../database";
import { User } from "../models/user";

export async function usersRoutes(app: FastifyInstance) {
    app.get('/getall', async () => {
        const tables = await knex<User[]>('usuarios').select('*')

        return tables
    });

    app.get('/:id', async (request) => {

        const getUserIdParamSchema = z.object({
            id: z.string(),
        });

        const { id } = getUserIdParamSchema.parse(request.params);

        const user = await knex<User>('usuarios').where({
            id: parseInt(id)
        })

        return user
    });

    app.post('/create', async (request, reply) => {

        const createUserBodySchema = z.object({
            nome: z.string(),
            email: z.string(),
            senha: z.string()
        });

        const { nome, email, senha } = createUserBodySchema.parse(request.body);

        const user = await knex<User>('usuarios').insert({
            nome: nome,
            data_criacao: new Date(),
            email: email,
            senha: senha
        });

        return reply.status(201).send()
    });
}