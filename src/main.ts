import {
  BadRequestException,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';

// Swagger configuraciones desde otro archivo
import {
  AllExceptionsFilter,
  ValidationExceptionFilter,
} from './core/errors/all-exceptions.filter';
import { setupSwagger } from './swagger';

interface ValidationError {
  property: string;
  constraints: { [key: string]: string };
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.setGlobalPrefix('api/v1');
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
      exceptionFactory: (errors: ValidationError[]): void => {
        const messages = errors.map(
          (err) =>
            `${err.property} - ${Object.values(err.constraints).join(', ')}`,
        );
        throw new BadRequestException(messages);
      },
    }),
  );

  // **** EXCEPTION FILTERS *****
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new ValidationExceptionFilter(),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000; // Valor por defecto de 3000 si PORT no está definido

  await app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
    
  });
}
bootstrap();
