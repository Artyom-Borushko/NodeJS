import express, { Express } from 'express';
import { userRoute } from './routers/userRoutes.js';
import { ResourceNotFoundHandler } from './middlewares/error-handlers/resourceNotFoundHandler.js';
import { InitializeSequelize } from './database/postgreSQL/initializeSequelize.js';
import 'dotenv/config';
import { errorHandler } from './middlewares/error-handlers/errorHandler.js';


const resourceNotFoundHandler = new ResourceNotFoundHandler().notFoundHandler;
const app: Express = express();


app.listen(process.env.PORT);
InitializeSequelize.getInstance().authenticate()
    .then(() => console.info('Connection to DB is working'))
    .catch(() => {
        throw 'DB connection error';
    });

app.use(express.json());
app.use('/users', userRoute);

app.use(errorHandler);
app.use(resourceNotFoundHandler);
