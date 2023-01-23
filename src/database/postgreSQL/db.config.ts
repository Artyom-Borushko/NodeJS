import { ClientConfig } from 'pg';
import 'dotenv/config';


const dbConfig: ClientConfig = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE
};

const sequelizeConnectionString = `${process.env.DB_DIALECT}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

export { dbConfig, sequelizeConnectionString };
