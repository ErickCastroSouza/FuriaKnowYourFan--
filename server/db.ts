import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

const pool = new pg.Pool({
    host: 'localhost',
    port: 5432,
    database: 'FURIA_DIGITAL',
    user: 'postgres',
    password: 'E7r7t7y7u7i7o7p7'
  });
  
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
  });
  
  export const db = drizzle(pool, { schema });