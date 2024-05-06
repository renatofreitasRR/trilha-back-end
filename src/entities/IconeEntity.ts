import { knex } from "../database";
import { Icone } from "../models/icone";

export class IconeEntity {

    public static async get(id:number) {
        const icone = await knex<Icone>("icone").where({
            TMACODIGO: id
        });
 
        if (icone.length == 0) {
            throw new Error("Icone não encontrado!");
        }

        return icone[0];
    }

    public static async delete(id:number):Promise<boolean> {

        const icone = await knex<Icone>("icone").where({
            TMACODIGO: id
        });
 
        if (icone.length == 0) {
            throw new Error("Icone não encontrado!");
        }

        await knex<Icone>("icone").where({
            TMACODIGO: id
        }).delete();

        return true;
    }

}