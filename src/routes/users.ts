import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { knex } from "../database";
import { User } from "../models/user";
import { usuarioTema } from "../models/usuario-tema";
import { Console } from "console";
import { ImageEntity } from "../entities/ImageEntity";
import { IconeEntity } from "../entities/IconeEntity";
import { PecaEntity } from "../entities/PecaEntity";
import { Tema } from "../models/tema";

type UpdateUserParamsType = {
    id: number
}

export async function usersRoutes(app: FastifyInstance) {

    app.get('/getall', async () => {
        const tables = await knex<User[]>('usuario').select("*");

        return tables;
    });

    app.get('/:id', async (request, reply) => {

        const getUserIdParamSchema = z.object({
            id: z.string(),
        });

        const { id } = getUserIdParamSchema.parse(request.params);

        const user = await knex<User>('usuario').where({
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
            senha: z.string(),
            moedas: z.number(),
        });

        const { nome, email, senha, moedas } = createUserBodySchema.parse(request.body);

        const user = await knex<User>('usuario').insert({
            usrnome: nome,
            usremail: email,
            usrsenha: senha,
            usrmoedas: moedas
        });

        return reply.status(201).send("Usuario criado com sucesso!");
    });

    app.post('/updateTemaAtivo/:id', async (request, reply) => {
        const { id } = request.params as UpdateUserParamsType;

        const userExists = await knex<User>("usuario").where({
            usrcodigo: id
        });

        if (userExists.length == 0) {
            return reply.status(404).send("Usuário não encontrado!");
        }

        const UpdateThemeBodySchema = z.object({
            tema_ativo: z.number(),
        });

        const { tema_ativo } = UpdateThemeBodySchema.parse(request.body);

        const temaExists = await knex<usuarioTema>("usuario_tema").select("*").where({
            tmacodigo: tema_ativo
        });

        if (temaExists.length == 0) {
            return reply.status(404).send("Tema não encontrado/comprado!");
        }

        await knex<User>("usuario").update({
            tema_ativo: tema_ativo,
        }).where({
            usrcodigo: id
        });

        return reply.status(200).send("Tema ativo atualizado com sucesso!");
    });

    app.get('/getTemaAtivo/:id', async (request, reply) => {
        const getUserIdParamSchema = z.object({
            id: z.string(),
        });

        const { id } = getUserIdParamSchema.parse(request.params);

        const user = await knex<User>('usuario').select('*').where({
            usrcodigo: parseInt(id)
        });

        if (user[0].tema_ativo == null) {
            return reply.status(404).send("Nenhum tema encontrado - definido tema padrão");
        }

        const tema = await knex<Tema>('tema').select('*').where({
            tmacodigo: user[0].tema_ativo
        });

        return tema;
    });

    app.get('/getIconAtivo/:id', async (request, reply) => {
        const getUserIdParamSchema = z.object({
            id: z.string(),
        });

        const { id } = getUserIdParamSchema.parse(request.params);

        const user = await knex<User>('usuario').select('*').where({
            usrcodigo: parseInt(id)
        });

        // o usuario deve ter um tema ativo, nem que seja o default
        /* if (user[0].TEMA_ATIVO == null) {
            return reply.status(404).send("Nenhum tema encontrado - definido tema padrão");
        } */

        const icon = await knex<Tema>('icone').select('*').where({
            tmacodigo: user[0].tema_ativo
        });

        return icon[0];
    });

    app.post("/update/:id", async (request, reply) => {

        const { id } = request.params as UpdateUserParamsType;

        const userExists = await knex<User>("usuario").where({
            usrcodigo: id,
        });

        if (userExists.length == 0) {
            return reply.status(404).send("Houve um erro ao editar!");
        }

        const UpdateUserBodySchema = z.object({
            nome: z.string().optional(),
            email: z.string().optional(),
            senha: z.string().optional(),
            moedas: z.number().optional()
        });

        const { nome, email, senha, moedas } = UpdateUserBodySchema.parse(request.body);

        const user = await knex<User>("usuario").update({
            usremail: email,
            usrnome: nome,
            usrsenha: senha,
            usrmoedas: moedas
        }).where({
            usrcodigo: id
        });

        return reply.status(201).send("Editado com sucesso!");
    });

    app.post("/delete/:id", async (request, reply) => {

        const { id } = request.params as UpdateUserParamsType;

        const userExists = await knex<User>("usuario").where({
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


    //funções moedas
    app.post("/addcoins/:id", async (request, reply) => {
        const { id } = request.params as UpdateUserParamsType;

        const addCoinsBodySchema = z.object({
            moedas: z.number()
        });

        const { moedas } = addCoinsBodySchema.parse(request.body);

        const userExists = await knex<User>("usuario").where({
            usrcodigo: Number(id),
        });

        if (userExists.length == 0) {
            return reply.status(404).send("Usuário não encontrado!");
        }

        const user = await knex<User>("usuario").where({
            usrcodigo: Number(id)
        }).increment('USRMOEDAS', moedas);

        return reply.status(201).send("Valor acrescentado com sucesso!");
    });

    app.post("/subtractcoins/:id", async (request, reply) => {
        const { id } = request.params as UpdateUserParamsType;

        const subtractCoinsBodySchema = z.object({
            moedas: z.number()
        });

        const { moedas } = subtractCoinsBodySchema.parse(request.body);

        const userExists = await knex<User>("usuario").where({
            usrcodigo: Number(id),
        });

        if (userExists.length == 0) {
            return reply.status(404).send("Usuário não encontrado!");
        }

        const user = userExists[0];

        const coins = await knex<User>("usuario").select("usrmoedas").where({
            usrcodigo: id,
        });


        if (coins[0].usrmoedas < moedas) {
            return reply.status(400).send("Não há saldo suficiente!");
        }

        await knex<User>("usuario").where({
            usrcodigo: Number(id)
        }).decrement('USRMOEDAS', moedas);

        return reply.status(200).send("Valor subtraído com sucesso!");
    });

    app.get("/getcoins/:id", async (request, reply) => {
        const getCoinsIdParamSchema = z.object({
            id: z.string(),
        });

        const { id } = getCoinsIdParamSchema.parse(request.params);

        const user = await knex<User>("usuario").select('usrmoedas').where({
            usrcodigo: parseInt(id),
        });

        if (user.length == 0) {
            return reply.status(404).send("Usuário não encontrado!");
        }

        return { USRMOEDAS: user[0].usrmoedas };
    });
}