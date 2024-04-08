import { knex as setupKnex, Knex } from 'knex'
import { env } from './env';

export const config: Knex.Config = {
    client: env.DATABASE_CLIENT,
    connection: env.DATABASE_CLIENT === 'mysql' ? {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '123',
        database: 'trilha',
        insecureAuth: true
    } : env.DATABASE_URL,
    useNullAsDefault: true,
}

export const knex = setupKnex(config);