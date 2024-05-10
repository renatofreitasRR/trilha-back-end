import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { knex } from "../database";
import { Image } from "../models/image";
import { Tema } from "../models/tema";
import { Icone } from "../models/icone";
import { Peca } from "../models/peca";

type UpdatePecaParamsType = {
    id: number
}

export async function pecaRoutes(app: FastifyInstance) {

    app.get('/getall', async () => {
        const tables = await knex<Peca[]>('peca').select("*");

        return tables;
    });

    app.get('/:id', async (request,reply) => {

        const getPecaIdParamSchema = z.object({
            id: z.string(),
        });

        const { id } = getPecaIdParamSchema.parse(request.params);

        const peca = await knex<Peca>('peca').where({
            PCACODIGO : parseInt(id)
        });

        if (peca.length <= 0) {
            return reply.status(404).send("A peça não existe!");
        }

        return peca;
    });

    app.post('/create', async (request, reply) => {

        const createPecaBodySchema = z.object({
            nome: z.string(),
            url: z.string(),
            tema_codigo :z.number(),
        });

        const { 
            nome,
            url,
            tema_codigo
        } = createPecaBodySchema.parse(request.body);

        const tema = await knex<Tema>("tema").where({
            TMACODIGO: tema_codigo
        });

        if (tema.length == 0) {
            return reply.status(404).send("Tema não encontrado!");
        }

        const peca = await knex<Peca>('peca').insert({
            PCANOME: nome,
            PCAURL: url,
            TMACODIGO : tema_codigo
        });

        return reply.status(201).send("Peca criada com sucesso!");
    });    

    app.post("/update/:id", async (request,reply) => {

        const { id } = request.params as UpdatePecaParamsType;

        const peca = await knex<Peca>("peca").where({
            PCACODIGO : id
        });

        if (peca.length == 0) {
            return reply.status(404).send("Houve um erro ao editar!");
        }

        const UpdatePecaBodySchema = z.object({
            nome: z.string().optional(),
            url: z.string().optional(),
            idTema: z.number(),
        });

        const { nome, url, idTema } = UpdatePecaBodySchema.parse(request.body);

        const tema = await knex<Tema>("tema").where({
            TMACODIGO: idTema
        });

        if (tema.length == 0) {
            return reply.status(404).send("Tema não encontrado!");
        }

        await knex<Peca>("peca").update({
            PCANOME: nome,
            PCAURL: url,
         }).where({
             TMACODIGO: idTema
         });

        return reply.status(201).send("Editado com sucesso!");
    });
}