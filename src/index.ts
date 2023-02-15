import express, { Express } from 'express';
import { userRoute } from './api/routes/userRoutes.js';
import { groupRoute } from './api/routes/groupRoutes.js';
import { ResourceNotFoundHandler } from './api/middlewares/error-handlers/resourceNotFoundHandler.js';
import { InitializeSequelize } from './database/postgreSQL/initializeSequelize.js';
import 'dotenv/config';
import { errorHandler } from './api/middlewares/error-handlers/errorHandler.js';
import { EntityRelationshipsInitializer } from './database/postgreSQL/entityRelationshipsInitializer.js';
import { LoggerMiddleware } from './api/middlewares/loggerMiddleware.js';
import { UnhandledExceptionsHandler } from './api/middlewares/error-handlers/unhandledExceptionsHandler.js';
import cors from 'cors';
import { corsConfig } from './core/configs/cors.config.js';


const resourceNotFoundHandler = new ResourceNotFoundHandler().notFoundHandler;
const serviceMethodsLogger = new LoggerMiddleware().serviceMethodsLogger;
const unhandledErrorsHandler = new UnhandledExceptionsHandler().listenForUnhandledExceptions;
const app: Express = express();


app.listen(process.env.PORT);
InitializeSequelize.getInstance().authenticate()
    .then(() => {
        console.info('Connection to DB is working');
        EntityRelationshipsInitializer.init();
        InitializeSequelize.getInstance().sync();
    })
    .catch(() => {
        throw 'DB connection error';
    });

app.use(cors(corsConfig));
app.use(express.json());
app.use(unhandledErrorsHandler);
app.use(serviceMethodsLogger);
app.use('/users', userRoute);
app.use('/groups', groupRoute);

app.use(errorHandler);
app.use(resourceNotFoundHandler);
