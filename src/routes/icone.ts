import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { knex } from "../database";
import { Image } from "../models/image";
import { Tema } from "../models/tema";
import { Icone } from "../models/icone";

type UpdateIconeParamsType = {
    id: number
}

export async function iconeRoutes(app: FastifyInstance) {

    app.get('/getall', async () => {
        const tables = await knex<Icone[]>('icone').select("*");

        return tables;
    });

    app.get('/getallbytema/:id', async (request, reply) => {

        const getTemaIdParamSchema = z.object({
            id: z.string(),
        });

        const { id } = getTemaIdParamSchema.parse(request.params);

        const tables = await knex<Icone[]>('icone').where('tmacodigo', id);

        return tables;
    });

    app.get('/:id', async (request, reply) => {

        const getIconeIdParamSchema = z.object({
            id: z.string(),
        });

        const { id } = getIconeIdParamSchema.parse(request.params);

        const icone = await knex<Icone>('icone').where({
            icncodigo: parseInt(id)
        });

        if (icone.length <= 0) {
            return reply.status(404).send("O icone não existe!");
        }

        return icone;
    });

    app.post('/create', async (request, reply) => {

        const createIconeBodySchema = z.object({
            icnnome: z.string(),
            icnurl: z.string(),
            tmacodigo: z.number()
        });

        const {
            icnnome,
            icnurl,
            tmacodigo
        } = createIconeBodySchema.parse(request.body);

        const tema = await knex<Tema>("tema").where({
            tmacodigo: tmacodigo
        });

        if (tema.length == 0) {
            return reply.status(404).send("Tema não encontrado!");
        }

        const icone = await knex<Icone>('icone').insert({
            icnnome: icnnome,
            icnurl: icnurl,
            tmacodigo: tmacodigo
        });

        return reply.status(201).send("Icone criado com sucesso!");
    });

    app.post("/update/:id", async (request, reply) => {

        const { id } = request.params as UpdateIconeParamsType;

        const icone = await knex<Icone>("icone").where({
            icncodigo: id
        });

        if (icone.length == 0) {
            return reply.status(404).send("Houve um erro ao editar!");
        }

        const UpdateIconeBodySchema = z.object({
            icnnome: z.string().optional(),
            icnurl: z.string().optional(),
        });

        const { icnnome, icnurl } = UpdateIconeBodySchema.parse(request.body);


        await knex<Icone>("icone").update({
            icnnome: icnnome,
            icnurl: icnurl,
        }).where({
            icncodigo: id
        });

        return reply.status(201).send("Editado com sucesso!");
    });

    app.post("/delete/:id", async (request, reply) => {

        const getIdParamSchema = z.object({
            id: z.number(),
        });

        const { id } = getIdParamSchema.parse(request.params);

        const iconExists = await knex<Icone>("icone").where({
            icncodigo: id,
        });

        if (iconExists.length == 0) {
            return reply.status(404).send("Houve um erro ao deletar!");
        }

        await knex<Icone>("icone").where({
            icncodigo: id,
        }).delete();

        return reply.status(201).send("Deletado com sucesso!");
    });
}