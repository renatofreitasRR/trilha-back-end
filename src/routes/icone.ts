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

        const tables = await knex<Icone[]>('icone').where('TMACODIGO', id);

        return tables;
    });

    app.get('/:id', async (request, reply) => {

        const getIconeIdParamSchema = z.object({
            id: z.string(),
        });

        const { id } = getIconeIdParamSchema.parse(request.params);

        const icone = await knex<Icone>('icone').where({
            ICNCODIGO: parseInt(id)
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
            TMACODIGO: tmacodigo
        });

        if (tema.length == 0) {
            return reply.status(404).send("Tema não encontrado!");
        }

        const icone = await knex<Icone>('icone').insert({
            ICNNOME: icnnome,
            ICNURL: icnurl,
            TMACODIGO: tmacodigo
        });

        return reply.status(201).send("Icone criado com sucesso!");
    });

    app.post("/update/:id", async (request, reply) => {

        const { id } = request.params as UpdateIconeParamsType;

        const icone = await knex<Icone>("icone").where({
            ICNCODIGO: id
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
            ICNNOME: icnnome,
            ICNURL: icnurl,
        }).where({
            ICNCODIGO: id
        });

        return reply.status(201).send("Editado com sucesso!");
    });
}