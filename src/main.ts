import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { MetricsModule } from './metrics/metrics.module';

async function bootstrap() {
  // Public app — all routes, port 4180
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({ origin: false });

  // Global validation pipe for strict DTO checking
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Teapot Service')
    .setDescription('Production (brews nothing)')
    .setVersion('1.0')
    .setTermsOfService('https://en.wikipedia.org/wiki/Geneva_Conventions')
    .addTag('brew')
    .addTag('health')
    .addTag('menu')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Custom swagger setup for deprecation and extreme enterprise style
  // Prefix /api is automatically applied to Swagger if setup after setGlobalPrefix
  SwaggerModule.setup('docs', app, document);

  // Start the impossibly rigid server
  const publicPort = process.env.PORT || 4180;
  await app.listen(publicPort);
  console.log(`Teapot is refusing connections on port ${publicPort}`);

  // Internal metrics app — port 3001, localhost only
  const metricsApp = await NestFactory.create(MetricsModule);
  await metricsApp.listen(3001, '127.0.0.1');
  console.log(`Metrics are being carefully monitored internally on port 3001`);
}
void bootstrap();
