import fp from 'fastify-plugin';
import fj, { FastifyJWTOptions } from 'fastify-jwt';
import { FastifyReply, FastifyRequest } from 'fastify';

/**
 * This plugins adds some utilities to configure CORS
 *
 * @see https://github.com/fastify/fastify-cors
 */
export default fp<FastifyJWTOptions>(async (fastify, opts) => {
  fastify.register(fj, {
    secret: process.env.JWT_SECRET!,
    decode: { complete: false },
    // sign: { expiresIn: 3_600 },
  });

  fastify.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      if (request.headers.authorization !== undefined) {
        try {
          fastify.jwt.verify(request.headers.authorization.split(' ')[1]);

          const decoded = fastify.jwt.decode(
            request.headers.authorization.split(' ')[1]
          )!;

          request.user = decoded.toString();
        } catch {}
      }
    }
  );
});

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate(): void;
  }
}
