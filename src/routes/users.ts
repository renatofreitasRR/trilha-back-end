import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { User } from "../models/user";

export async function usersRoutes(app: FastifyInstance) {

    app.get('/db', async () => {
        const tables = await knex<User[]>('usuarios').select('*')

        return tables
    });

    app.post('/create', async () => {
        const user = await knex<User>('usuarios').insert({
            nome: 'Inserindo KNEX',
            data_criacao: new Date(),
            email: `${new Date()}@email.com`,
            senha: '123'
        });

        return user
    });
}