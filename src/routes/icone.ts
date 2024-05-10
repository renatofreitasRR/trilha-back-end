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

    app.get('/:id', async (request,reply) => {

        const getIconeIdParamSchema = z.object({
            id: z.string(),
        });

        const { id } = getIconeIdParamSchema.parse(request.params);

        const icone = await knex<Icone>('icone').where({
            ICNCODIGO : parseInt(id)
        });

        if (icone.length <= 0) {
            return reply.status(404).send("O icone não existe!");
        }

        return icone;
    });

    app.post('/create', async (request, reply) => {

        const createIconeBodySchema = z.object({
            nome: z.string(),
            url: z.string(),
            tema_codigo :z.number(),
        });

        const { 
            nome,
            url,
            tema_codigo
        } = createIconeBodySchema.parse(request.body);

        const tema = await knex<Tema>("tema").where({
            TMACODIGO: tema_codigo
        });

        if (tema.length == 0) {
            return reply.status(404).send("Tema não encontrado!");
        }

        const icone = await knex<Icone>('icone').insert({
            ICNNOME: nome,
            ICNURL: url,
            TMACODIGO : tema_codigo
        });        

        return reply.status(201).send("Icone criado com sucesso!");
    });    
    
    app.post("/update/:id", async (request,reply) => {

        const { id } = request.params as UpdateIconeParamsType;

        const icone = await knex<Icone>("icone").where({
            ICNCODIGO : id
        });

        if (icone.length == 0) {
            return reply.status(404).send("Houve um erro ao editar!");
        }

        const UpdateIconeBodySchema = z.object({
            nome: z.string().optional(),
            url: z.string().optional(),
            idTema: z.number(),
        });

        const { nome, url, idTema } = UpdateIconeBodySchema.parse(request.body);

        const tema = await knex<Tema>("tema").where({
            TMACODIGO: idTema
        });

        if (tema.length == 0) {
            return reply.status(404).send("Tema não encontrado!");
        }

        await knex<Icone>("icone").update({
            ICNNOME: nome,
            ICNURL: url,
         }).where({
            TMACODIGO: idTema
         });

        return reply.status(201).send("Editado com sucesso!");
    });
}