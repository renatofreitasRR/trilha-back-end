import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { knex } from "../database";
import { User } from "../models/user";

type UpdateUserParamsType = {
    id: number
}

export async function usersRoutes(app: FastifyInstance) {

    app.get('/getall', async () => {
        const tables = await knex<User[]>('usuarios').select("*");

        return tables;
    });

    app.get('/:id', async (request, reply) => {

        const getUserIdParamSchema = z.object({
            id: z.string(),
        });

        const { id } = getUserIdParamSchema.parse(request.params);

        const user = await knex<User>('usuarios').where({
            usrcodigo: parseInt(id)
        });

        if (user.length <= 0) {
            return reply.status(404).send("Nenhum usuario foi encontrada!");
        }

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
            usrnome: nome,
            usremail: email,
            usrsenha: senha
        });

        return reply.status(201).send("Usuario criado com sucesso!");
    });

    app.post("/update/:id", async (request, reply) => {

        const { id } = request.params as UpdateUserParamsType;

        const userExists = await knex<User>("usuarios").where({
            usrcodigo: id,
        });

        if (userExists.length == 0) {
            return reply.status(404).send("Houve um erro ao editar!");
        }

        const UpdateUserBodySchema = z.object({
            nome: z.string().optional(),
            email: z.string().optional(),
            senha: z.string().optional()
        });

        const { nome, email, senha } = UpdateUserBodySchema.parse(request.body);

        const user = await knex<User>("usuarios").update({
            usremail: email,
            usrnome: nome,
            usrsenha: senha
        }).where({
            usrcodigo: id
        });

        return reply.status(201).send("Editado com sucesso!");
    });

    app.post("/delete/:id", async (request, reply) => {

        const { id } = request.params as UpdateUserParamsType;

        const userExists = await knex<User>("usuarios").where({
            usrcodigo: id,
        });

        if (userExists.length == 0) {
            return reply.status(404).send("Houve um erro ao deletar!");
        }

        await knex<User>("usuarios").where({
            usrcodigo: id,
        }).delete();

        return reply.status(201).send("Deletado com sucesso!");
    });
}