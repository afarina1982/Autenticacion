import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true}));
  const configService: ConfigService = app.get(ConfigService);
  app.enableCors({
    origin: '*',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
  });

  const config = new DocumentBuilder()
  .setTitle('Evaluacion Seguridad')
  .setDescription('Gestion de Permisos')
  .setVersion('1.0.0')
  .addTag('Seguridad')  // Aquí puedes agregar tags si es necesario
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);

  await app.listen(4500);
}
bootstrap();
