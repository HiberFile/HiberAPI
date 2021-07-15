import fp from 'fastify-plugin';
import fc, { FastifyCorsOptions } from 'fastify-cors';

/**
 * This plugins adds some utilities to configure CORS
 *
 * @see https://github.com/fastify/fastify-cors
 */
export default fp<FastifyCorsOptions>(async (fastify, opts) => {
  fastify.register(fc, {
    origin: '*',
    // origin: [/localhost:\d+$/, /\.?hiberfile\.com$/],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  });
});
