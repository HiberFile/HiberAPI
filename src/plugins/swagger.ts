import fp from 'fastify-plugin';
import swagger, { SwaggerOptions } from 'fastify-swagger';

/**
 * This plugins adds Swagger compatibility
 *
 * @see https://github.com/fastify/fastify-swagger
 */
export default fp<SwaggerOptions>(async (fastify, opts) => {
  fastify.register(swagger, {
    routePrefix: '/documentation',
    swagger: {
      info: {
        title: 'HiberAPI',
        version: '2021.2.0',
      },
      host: 'api.hiberfile.com',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        basicAuth: { type: 'basic' },
      },
    },
    uiConfig: {
      deepLinking: true,
    },
    exposeRoute: true,
  });
});
