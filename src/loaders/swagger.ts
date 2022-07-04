const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const config = require('../app/config/app');
const swaggerConfig = require('../app/config/swagger');

import { Express } from 'express';

const options = {
  definition: {
    openapi: swaggerConfig.openapi,
    info: {
      title: config.name,
      version: config.version,
    },
    servers: [
      {
        url: 'http://localhost:{port}{basePath}',
        variables: {
          port: {
            default: config.port,
          },
          basePath: {
            default: config.api.prefix,
          },
        },
        description: 'Local Server',
      },
    ],
  },
  apis: ['./src/app/routes/v1/api.ts'],
};

module.exports = (app: Express) => {
  const swaggerSpec = swaggerJSDoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  return app;
};
