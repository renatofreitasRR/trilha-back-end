import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { knex } from "../database";
import { Image } from "../models/image";
import { User } from "../models/user";
import { usuarioImagemModel } from "../models/usuario-image-model";

type UpdateImageParamsType = {
    id: number
}

export async function usuarioImagensRoutes(app: FastifyInstance) {

    app.get('/:id/getall', async (request,reply) => {

        const getUserIdParamSchema = z.object({
            id: z.string(),
        });

        const { id } = getUserIdParamSchema.parse(request.params);

        const user : User[] = await knex<User>('usuarios').where({
            USRCODIGO: parseInt(id)
        });

        if(user.length <= 0) {
            return reply.status(404).send("Nenhum usuário foi encontrada!");
        }

        const usuario_imagens : usuarioImagemModel[] = await knex<usuarioImagemModel>("usuario_imagem").select("*").where({
            USRCODIGO : user[0].USRCODIGO
        });

        if(usuario_imagens.length <= 0) {
            return reply.status(404).send("Nenhuma imagem foi encontrada!");
        }
        
        let imagens: Image[] = [];

        await Promise.all(usuario_imagens.map(async (relacao) => {
            const imagem = await knex<Image>("imagem").select("*").where({
                IMGCODIGO: relacao.IMGCODIGO
            });
            imagens.push(imagem[0]);
        }));
        
        return {
            "usuario" : user,
            "imagens": imagens,
            "relacao" : usuario_imagens
        };
    });

    app.post('/create', async (request, reply) => {

        const createImageBodySchema = z.object({
            nome: z.string(),
            url: z.string(),
            preco: z.number(),
            tema_codigo :z.number(),
        });

        const { 
            nome,
            url,
            preco,
            tema_codigo
        } = createImageBodySchema.parse(request.body);

        const image = await knex<Image>('imagem').insert({
            IMGNOME: nome,
            IMGPRECO:preco,
            IMGURL: url,
            TMACODIGO : tema_codigo
        });

        return reply.status(201).send("Imagem criado com sucesso!");
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

/* 
    app.post("/update/:id", async (request,reply) => {

        const { id } = request.params as UpdateImageParamsType;

        const userExists = await knex<Image>("usuarios").where({
            id,
        });

        if (userExists.length == 0) {
            return reply.status(404).send("Houve um erro ao editar!");
        }

        const UpdateImageBodySchema = z.object({
            nome: z.string().optional(),
            email: z.string().optional(),
            senha: z.string().optional()
        });

        const { nome, email, senha } = UpdateImageBodySchema.parse(request.body);

        const user = await knex<Image>("usuarios").update({
            email,
            nome,
            senha
        }).where({
            id
        });

        return reply.status(201).send("Editado com sucesso!");
    });

    app.post("/delete/:id", async (request,reply) => {

        const { id } = request.params as UpdateImageParamsType;

        const userExists = await knex<Image>("usuarios").where({
            id,
        });

        if (userExists.length == 0) {
            return reply.status(404).send("Houve um erro ao deletar!");
        }

        const user = await knex<Image>("usuarios").update({
            ativo : 0
        }).where({
            id
        });

        return reply.status(201).send("Deletado com sucesso!");
    }); 
    */
}