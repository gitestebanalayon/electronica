import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config();

export default registerAs('swagger', () => ({
  siteTitle: process.env.SWAGGER_SITE_TITLE || 'Swagger API',
  docTitle: process.env.SWAGGER_DOC_TITLE || 'API Documentation',
  docDescription: process.env.SWAGGER_DOC_DESCRIPTION || 'API Description',
  docVersion: process.env.SWAGGER_DOC_VERSION || 'v1.0',
  serverUrl: process.env.SWAGGER_DOC_SERVER_URL || 'http://localhost',
  nameServerUrl:
    process.env.SWAGGER_DOC_NAME_SERVER_URL || 'Development Server',
}));
