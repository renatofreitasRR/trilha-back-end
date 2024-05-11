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

    app.get('/getallbytema/:id', async (request, reply) => {

        const getTemaIdParamSchema = z.object({
            id: z.string(),
        });

        const { id } = getTemaIdParamSchema.parse(request.params);

        const tables = await knex<Peca[]>('peca').where('tmacodigo', id);

        return tables;
    });

    app.get('/:id', async (request, reply) => {

        const getPecaIdParamSchema = z.object({
            id: z.string(),
        });

        const { id } = getPecaIdParamSchema.parse(request.params);

        const peca = await knex<Peca>('peca').where({
            pcacodigo: parseInt(id)
        });

        if (peca.length <= 0) {
            return reply.status(404).send("A peça não existe!");
        }

        return peca;
    });

    app.post('/create', async (request, reply) => {

        const createPecaBodySchema = z.object({
            pcanome: z.string(),
            pcaurl: z.string(),
            tmacodigo: z.number(),
        });

        console.log("STEP 1");

        const {
            pcanome,
            pcaurl,
            tmacodigo
        } = createPecaBodySchema.parse(request.body);

        const tema = await knex<Tema>("tema").where({
            tmacodigo: tmacodigo
        });

        if (tema.length == 0) {
            return reply.status(404).send("Tema não encontrado!");
        }

        console.log("STEP 2");

        const peca = await knex<Peca>('peca').insert({
            pcanome: pcanome,
            pcaurl: pcaurl,
            tmacodigo: tmacodigo
        });

        return reply.status(201).send("Peca criada com sucesso!");
    });

    app.post("/update/:id", async (request, reply) => {

        const { id } = request.params as UpdatePecaParamsType;

        const peca = await knex<Peca>("peca").where({
            pcacodigo: id
        });

        if (peca.length == 0) {
            return reply.status(404).send("Houve um erro ao editar!");
        }

        const UpdatePecaBodySchema = z.object({
            pcanome: z.string().optional(),
            pcaurl: z.string().optional(),
        });

        const { pcanome, pcaurl } = UpdatePecaBodySchema.parse(request.body);

        await knex<Peca>("peca").update({
            pcanome: pcanome,
            pcaurl: pcaurl,
        }).where({
            pcacodigo: id
        });

        return reply.status(201).send("Editado com sucesso!");
    });

    app.post("/delete/:id", async (request, reply) => {

        const getIdParamSchema = z.object({
            id: z.number(),
        });

        const { id } = getIdParamSchema.parse(request.params);

        const pcaExists = await knex<Peca>("peca").where({
            pcacodigo: id,
        });

        if (pcaExists.length == 0) {
            return reply.status(404).send("Houve um erro ao deletar!");
        }

        await knex<Peca>("peca").where({
            pcacodigo: id,
        }).delete();

        return reply.status(201).send("Deletado com sucesso!");
    });
}

