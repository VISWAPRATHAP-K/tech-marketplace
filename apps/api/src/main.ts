import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend Next.js application
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  // Setup Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Omnichannel Tech Marketplace API')
    .setDescription(
      'REST API for electronics products, specs (CPU, GPU, RAM, Storage), bookings, inquiries, nearby stores, and multi-tenant admin portals.',
    )
    .setVersion('1.0')
    .addTag('products')
    .addTag('stores')
    .addTag('bookings')
    .addTag('enquiries')
    .addTag('admin')
    .addTag('auth')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`Server running on: http://localhost:${port}`);
  logger.log(`Swagger documentation available at: http://localhost:${port}/api/docs`);
}

bootstrap();
