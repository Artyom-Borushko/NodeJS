export const corsConfig = {
    origin: '*',
    allowedHeaders: ['x-access-token', 'Content-Type'],
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    maxAge: 86400
};
