import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';

// Swagger configuraciones desde otro archivo
import { setupSwagger } from './swagger';
import { AllExceptionsFilter } from './core/errors/all-exceptions.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  // swagger configuración
  setupSwagger(app);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true, // Permite enviar campos que no existen
      transform: true,
      forbidUnknownValues: true,
      stopAtFirstError: true,
      validateCustomDecorators: true,
    }),
  );

  // **** EXCEPTION FILTERS *****
  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000; // Valor por defecto de 3000 si PORT no está definido

  await app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
}
bootstrap();
