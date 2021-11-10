import { FastifyPluginAsync, FastifySchema } from 'fastify';
import prisma from '../../../../utils/prisma';

const schema: FastifySchema = {
  description:
    'Get the users webhooks.',
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
      type: 'null',
      description: 'The webhook has been added.',
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

      const webhooks = await prisma.userWebhooks.findFirst({
        where: { user: { id: user.id } },
        select: {
          newFileUploading: { select: { url: true, id: true } },
          newFileUploaded: { select: { url: true, id: true } },
          newFileDownloaded: { select: { url: true, id: true } },
        },
      })

      return reply.send({ webhooks: webhooks ?? {
        newFileUploading: [],
        newFileUploaded: [],
        newFileDownloaded: [],
      }});
    }
  );
};

export default route;
