import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';

export const winstonLogger = WinstonModule.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike('Teapot', {
          colors: true,
          appName: true,
        }),
      ),
    }),
    new winston.transports.File({
      filename: 'teapot-system.log',
      format: winston.format.json(),
    }),
  ],
});
