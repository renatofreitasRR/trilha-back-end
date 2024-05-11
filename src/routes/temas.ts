import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { knex } from "../database";
import { Tema } from "../models/tema";
import { ImageEntity } from "../entities/ImageEntity";
import { IconeEntity } from "../entities/IconeEntity";
import { PecaEntity } from "../entities/PecaEntity";
import { Image, Image as ImagemBD } from "../models/image";
import { Peca } from "../models/peca";
import { Icone } from "../models/icone";

type UpdateTemaParamsType = {
    id: number
}

export async function temasRoutes(app: FastifyInstance) {

    app.get('/getall', async () => {
        const tables = await knex<Tema[]>('tema').select("*");

        return tables;
    });

    app.get('/:id', async (request, reply) => {

        const getUserIdParamSchema = z.object({
            id: z.string(),
        });

        const { id } = getUserIdParamSchema.parse(request.params);

        const tema = await knex<Tema>('tema').where({
            tmacodigo: parseInt(id)
        });

        if (tema.length <= 0) {
            return reply.status(404).send("Nenhum tema foi encontrada!");
        }

        try {
            const response: any = {};

            response.imagem = await ImageEntity.get(parseInt(id));
            response.icone = await IconeEntity.get(parseInt(id));
            response.peca = await PecaEntity.get(parseInt(id));

            return { "tema": { ...tema[0], ...response } };

        } catch (error) {
            return reply.status(404).send(error);
        }

    });

    app.post('/create', async (request, reply) => {

        const createTemaBodySchema = z.object({
            tema: z.object({
                tmanome: z.string(),
                tmapreco: z.number(),
            }),
            icone: z.object({
                icnnome: z.string(),
                icnurl: z.string()
            }),
            peca: z.object({
                pcanome: z.string(),
                pcaurl: z.string()
            }),
            imagem: z.object({
                imgnome: z.string(),
                imgurl: z.string()
            })
        });

        const {
            tema,
            icone,
            imagem,
            peca
        } = createTemaBodySchema.parse(request.body);

        try {
            const temaInserted = await knex<Tema>('tema').returning('tmacodigo').insert({
                tmanome: tema.tmanome,
                tmapreco: tema.tmapreco
            })

            const id = temaInserted[0];

            console.log("ID GERADO", id);

            await knex<Image>('imagem').insert({
                imgnome: imagem.imgnome,
                imgurl: imagem.imgurl,
                tmacodigo: id
            });

            await knex<Peca>('peca').insert({
                pcanome: peca.pcanome,
                pcaurl: peca.pcaurl,
                tmacodigo: id
            });

            await knex<Icone>('icone').insert({
                icnnome: icone.icnnome,
                icnurl: icone.icnurl,
                tmacodigo: id
            });

            return reply.status(201).send("Tema criado com sucesso!");
        }
        catch (err: any) {
            console.log("ERROR - Create - Tema", err);

            return reply.status(500).send("Erro ao criar tema!");
        }


    });

    app.post("/update/:id", async (request, reply) => {

        const { id } = request.params as UpdateTemaParamsType;

        const temaExiste = await knex<Tema>("tema").where({
            tmacodigo: id
        });

        if (temaExiste.length == 0) {
            return reply.status(404).send("Tema não encontrado!");
        }

        const UpdateTemaBodySchema = z.object({
            nome: z.string().optional(),
            preco: z.number().optional()
        });

        const { nome, preco } = UpdateTemaBodySchema.parse(request.body);

        const user = await knex<Tema>("tema").update({
            tmanome: nome,
            tmapreco: preco
        }).where({
            tmacodigo: id
        });

        return reply.status(201).send("Editado com sucesso!");
    });

    app.post("/delete/:id", async (request, reply) => {

        const { id } = request.params as UpdateTemaParamsType;

        const temaExiste = await knex<Tema>("tema").where({
            tmacodigo: id
        });

        if (temaExiste.length == 0) {
            return reply.status(404).send("Tema não encontrado!");
        }

        try {
            await ImageEntity.delete(id);
            await IconeEntity.delete(id);
            await PecaEntity.delete(id);

            await knex<Tema>("tema").where({
                tmacodigo: id
            }).delete();

            return reply.status(201).send("Tema deletado com sucesso!");
        } catch (error) {
            return reply.status(404).send(error);
        }

    });

}