import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
  SwaggerModule.setup('docs', app, document);

  // Start the impossibly rigid server
  const port = process.env.PORT || 4180;
  await app.listen(port);
  console.log(`Teapot is refusing connections on port ${port}`);
}
void bootstrap();
