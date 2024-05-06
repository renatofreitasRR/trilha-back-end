import 'dotenv/config';
import { z } from 'zod';

// host: 'localhost',
// port: 3306,
// user: 'root',
// password: '123',
// database: 'trilha',

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production']).default('production'),
    DATABASE_CLIENT: z.enum(['mysql', 'pg']),
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3333),
});

export const env = envSchema.parse(process.env);

env;