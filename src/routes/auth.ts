import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { knex } from "../database";
import { Image } from "../models/image";
import { Tema } from "../models/tema";
import { User } from "../models/user";

export async function authRoutes(app: FastifyInstance) {
    
    app.post("/login",async (request, reply) => {

        const userLogin = z.object({
            email: z.string(),
            senha: z.string(),
        });

        const { email,senha } = userLogin.parse(request.body);
     
        const user = await knex<User>('usuario').where({
            usremail : email,
            usrsenha : senha
        });

        if (user.length <= 0) {
            return reply.status(404).send("E-mail ou senha incorretos!");
        }
        return user[0];
    })

};
