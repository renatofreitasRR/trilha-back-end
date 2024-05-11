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

    app.get('/getallbytema/:id', async (request, reply) => {

        const getTemaIdParamSchema = z.object({
            id: z.string(),
        });

        const { id } = getTemaIdParamSchema.parse(request.params);

        const tables = await knex<Image[]>('imagem').where('tmacodigo', id);

        return tables;
    });

    app.get('/:id', async (request, reply) => {

        const getImageIdParamSchema = z.object({
            id: z.string(),
        });

        const { id } = getImageIdParamSchema.parse(request.params);

        const imagem = await knex<Image>('imagem').where({
            imgcodigo: parseInt(id)
        });

        if (imagem.length <= 0) {
            return reply.status(404).send("A imagem não existe!");
        }

        return imagem;
    });

    app.post('/create', async (request, reply) => {

        const createImageBodySchema = z.object({
            imgnome: z.string(),
            imgurl: z.string(),
            tmacodigo: z.number(),
        });

        const {
            imgnome,
            imgurl,
            tmacodigo
        } = createImageBodySchema.parse(request.body);

        const tema = await knex<Tema>("tema").where({
            tmacodigo: tmacodigo
        });

        if (tema.length == 0) {
            return reply.status(404).send("Tema não encontrado!");
        }

        const image = await knex<Image>('imagem').insert({
            imgnome: imgnome,
            imgurl: imgurl,
            tmacodigo: tmacodigo
        });

        return reply.status(201).send("Imagem criado com sucesso!");
    });

    app.post("/update/:id", async (request, reply) => {

        const { id } = request.params as UpdateImageParamsType;

        const imagem = await knex<Image>("imagem").where({
            imgcodigo: id
        });

        if (imagem.length == 0) {
            return reply.status(404).send("Houve um erro ao editar!");
        }

        const UpdateImageBodySchema = z.object({
            imgnome: z.string().optional(),
            imgurl: z.string().optional(),
        });

        const { imgnome, imgurl } = UpdateImageBodySchema.parse(request.body);

        await knex<Image>("imagem").update({
            imgnome: imgnome,
            imgurl: imgurl,
        }).where({
            imgcodigo: id
        });

        return reply.status(201).send("Editado com sucesso!");
    });
}