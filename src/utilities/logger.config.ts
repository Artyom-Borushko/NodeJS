import * as winston from 'winston';
const { combine, timestamp, colorize, align, printf, metadata, splat } = winston.format;


export const loggerConfig = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        colorize({ all: true }),
        timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A'
        }),
        align(),
        splat(),
        metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [new winston.transports.Console()],
    exceptionHandlers: [new winston.transports.Console()],
    rejectionHandlers: [new winston.transports.Console()]
});
