import { FastifyPluginAsync, FastifySchema } from 'fastify';
import prisma from '../../../../utils/prisma';

const schema: FastifySchema = {
  description: 'Get the available files of the user.',
  params: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'The HiberFile user id.' },
    },
  },
  security: [
    {
      basicAuth: [],
    },
  ],
  response: {
    200: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          description: "The list of the user's files available.",
          items: {
            type: 'object',
            properties: {
              hiberfileId: {
                type: 'string',
                description: 'The HiberFile id.',
              },
              filename: {
                type: 'string',
                description: 'The name of the file.',
              },
              expire: {
                type: 'string',
                format: 'date-time',
                description: 'The expiration date of the file.',
              },
            },
          },
        },
      },
    },
  },
};

interface IQuerystring {}
interface IParams {
  id: string;
}
interface IBody {}
interface IHeaders {
  authorization: string;
}

const route: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get<{
    Querystring: IQuerystring;
    Params: IParams;
    Body: IBody;
    Headers: IHeaders;
  }>(
    '/',
    { schema, preValidation: [fastify.authenticate] },
    async (request, reply) => {
      if (request.user === undefined)
        return reply.unauthorized('You are not logged in.');

      const user = await prisma.user.findUnique({
        where: { id: parseInt(request.user as string) },
        include: { files: true },
      });

      if (user === null) return reply.notFound('The user was not found.');

      const files = user.files.map((file) => ({
        hiberfileId: file.hiberfileId,
        filename: file.name,
        expire: file.expire,
      }));

      return reply.send({ files });
    }
  );
};

export default route;
