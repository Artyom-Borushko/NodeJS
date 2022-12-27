import express, { Express } from 'express';
import { userRoute } from './routers/userRoutes.js';
import { ResourceNotFound } from './middlewares/error-handlers/resourceNotFound.js';

const notFoundHandler = new ResourceNotFound().notFoundHandler;
const app: Express = express();


app.listen(3000);

app.use(express.json());
app.use('/users', userRoute);

app.use(notFoundHandler);
