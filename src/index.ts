import express, { Express } from 'express';
import { userRoute } from './routers/userRoutes.js';
import { ResourceNotFound } from './middlewares/error-handlers/resourceNotFound.js';
import { InitializeSequelize } from './database/postgreSQL/initializeSequelize.js';
import 'dotenv/config';

const notFoundHandler = new ResourceNotFound().notFoundHandler;
const app: Express = express();


app.listen(process.env.PORT);
InitializeSequelize.getInstance().authenticate()
    .then(() => console.info('Connection to DB is working'))
    .catch(() => {
        throw 'DB connection error';
    });

app.use(express.json());
app.use('/users', userRoute);

app.use(notFoundHandler);
