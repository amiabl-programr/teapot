import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import configuration from './config/configuration';

import { BrewModule } from './brew/brew.module';
import { HealthModule } from './health/health.module';
import { MenuModule } from './menu/menu.module';
import { TelemetryModule } from './telemetry/telemetry.module';

import { TeapotExceptionFilter } from './common/filters/teapot-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TracingInterceptor } from './common/interceptors/tracing.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      // Dev (ts-node): serve directly from src/public
      // Prod (Docker):  public/ is copied alongside dist/ by the Dockerfile
      rootPath:
        process.env.NODE_ENV === 'production'
          ? join(__dirname, '..', 'public')
          : join(process.cwd(), 'src', 'public'),
      serveRoot: '/',
      exclude: ['/api/*', '/docs/*', '/metrics/*', '/health/*'],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('rateLimit.ttl') || 60000,
          limit: config.get<number>('rateLimit.limit') || 3,
          errorMessage: 'The kettle needs time to cool down.',
        },
      ],
    }),
    BrewModule,
    HealthModule,
    MenuModule,
    TelemetryModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: TeapotExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TracingInterceptor,
    },
  ],
})
export class AppModule {}
