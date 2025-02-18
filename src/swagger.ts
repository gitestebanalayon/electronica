import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

export const setupSwagger = async (app: INestApplication): Promise<void> => {
  console.log('Swagger setup Active');

  const configService = app.get(ConfigService);
  const swaggerConfig = configService.get('swagger');

  const config = new DocumentBuilder()
    .setTitle(swaggerConfig.docTitle)
    .setDescription(swaggerConfig.docDescription)
    .setVersion(swaggerConfig.docVersion)
    .addServer(swaggerConfig.serverUrl, swaggerConfig.nameServerUrl, null)
    .addBearerAuth()
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: false,
      defaultModelsExpandDepth: -1,
    },
    customSiteTitle: swaggerConfig.siteTitle,
  };

  SwaggerModule.setup('docs', app, document, customOptions);
};
