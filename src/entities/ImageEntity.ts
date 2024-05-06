import { knex } from "../database";
import { Image } from "../models/image";

export class ImageEntity {

    public static async get(id:number) : Promise<Image> {
        const imagem = await knex<Image>("imagem").where({
            TMACODIGO: id
        });
 
        if (imagem.length == 0) {
            throw new Error("Imagem não encontrado!");
        }

        return imagem[0];
    }

    public static async delete(id:number) {

        const imagem = await knex<Image>("imagem").where({
            TMACODIGO: id
        });
 
        if (imagem.length == 0) {
            throw new Error("Imagem não encontrada!");
        }

        await knex<Image>("imagem").where({
            TMACODIGO: id
        }).delete();

        return true;
    }

}