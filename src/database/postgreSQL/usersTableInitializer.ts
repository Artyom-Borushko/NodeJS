import { dbConfig } from './db.config.js';
import { initialUsers } from '../../storage/initialUsers.js';
import pg, { QueryConfig } from 'pg';
const { Client } = pg;


const client = new Client(dbConfig);

const createTableQuery = `CREATE TABLE users (
    id VARCHAR,
    login VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    age INT NOT NULL,
    isDeleted BOOLEAN,
    PRIMARY KEY (id)
);`;

const insertUsersDataQuery = `INSERT INTO users(id, isDeleted, login, password, age) 
    VALUES($1, $2, $3, $4, $5)`;

async function initializeTable(): Promise<void> {
    await client.query<QueryConfig>(createTableQuery);
}

async function addMockUsers(): Promise<void> {
    for (const user of initialUsers) {
        const userDataToQuery = Object.values(user);
        await client.query<QueryConfig>(insertUsersDataQuery, userDataToQuery);
    }
}

async function start() {
    try {
        await client.connect();
        await initializeTable();
        await addMockUsers();
        await client.end();
    } catch (e) {
        console.error('Error creating table with mock users:', e);
        await client.end();
    }
}

start();
