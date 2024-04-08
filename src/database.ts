import { knex as setupKnex, Knex } from 'knex'

export const config: Knex.Config = {
    client: 'mysql',
    connection: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '123',
        database: 'trilha',
        insecureAuth: true
    },
    useNullAsDefault: true,
}

export const knex = setupKnex(config);