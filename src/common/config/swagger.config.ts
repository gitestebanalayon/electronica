import { registerAs } from '@nestjs/config';

export default registerAs('swagger', () => ({
  siteTitle: process.env.SWAGGER_SITE_TITLE || 'Swagger API',
  docTitle: process.env.SWAGGER_DOC_TITLE || 'API Documentation',
  docDescription: process.env.SWAGGER_DOC_DESCRIPTION || 'API Description',
  docVersion: process.env.SWAGGER_DOC_VERSION || '1.0',
  serverUrl: process.env.SWAGGER_DOC_SERVER_URL || 'https://electronica-swagger-api.up.railway.app',
  nameServerUrl:
    process.env.SWAGGER_DOC_NAME_SERVER_URL || 'Development Server',
}));
