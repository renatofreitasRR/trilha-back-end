import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { knex } from "../database";
import { Image } from "../models/image";
import { Tema } from "../models/tema";

type UpdateImageParamsType = {
    id: number
}

export async function imagesRoutes(app: FastifyInstance) {

    app.get('/getall', async () => {
        const tables = await knex<Image[]>('imagem').select("*");

        return tables;
    });

    app.get('/:id', async (request,reply) => {

        const getImageIdParamSchema = z.object({
            id: z.string(),
        });

        const { id } = getImageIdParamSchema.parse(request.params);

        const imagem = await knex<Image>('imagem').where({
            IMGCODIGO : parseInt(id)
        });

        if (imagem.length <= 0) {
            return reply.status(404).send("A imagem não existe!");
        }

        return imagem;
    });

    app.post('/create', async (request, reply) => {

        const createImageBodySchema = z.object({
            nome: z.string(),
            url: z.string(),
            tema_codigo :z.number(),
        });

        const { 
            nome,
            url,
            tema_codigo
        } = createImageBodySchema.parse(request.body);

        const tema = await knex<Tema>("tema").where({
            TMACODIGO: tema_codigo
        });

        if (tema.length == 0) {
            return reply.status(404).send("Tema não encontrado!");
        }

        const image = await knex<Image>('imagem').insert({
            IMGNOME: nome,
            IMGURL: url,
            TMACODIGO : tema_codigo
        });

        return reply.status(201).send("Imagem criado com sucesso!");
    });    

    app.post("/update/:id", async (request,reply) => {

        const { id } = request.params as UpdateImageParamsType;

        const imagem = await knex<Image>("imagem").where({
            IMGCODIGO : id
        });

        if (imagem.length == 0) {
            return reply.status(404).send("Houve um erro ao editar!");
        }

        const UpdateImageBodySchema = z.object({
            nome: z.string().optional(),
            url: z.string().optional(),
            idTema: z.number(),
        });

        const { nome, url,idTema } = UpdateImageBodySchema.parse(request.body);

        const tema = await knex<Tema>("tema").where({
            TMACODIGO: idTema
        });

        if (tema.length == 0) {
            return reply.status(404).send("Tema não encontrado!");
        }

        await knex<Image>("imagem").update({
            IMGNOME: nome,
            IMGURL: url,
         }).where({
             TMACODIGO: idTema
         });

        return reply.status(201).send("Editado com sucesso!");
    });
}