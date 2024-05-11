import { knex } from "../database";
import { Peca } from "../models/peca";

export class PecaEntity {

    public static async get(id: number) {
        const peca = await knex<Peca>("peca").where({
            tmacodigo: id
        });

        if (peca.length == 0) {
            throw new Error("Peça não encontrada!");
        }

        return peca[0];
    }

    public static async delete(id: number): Promise<boolean> {

        const peca = await knex<Peca>("peca").where({
            tmacodigo: id
        });

        if (peca.length == 0) {
            throw new Error("Peça não encontrado!");
        }

        await knex<Peca>("peca").where({
            tmacodigo: id
        }).delete();

        return true;
    }

}