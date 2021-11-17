import { FastifyPluginAsync, FastifySchema } from 'fastify';
import prisma from '../../../../../../utils/prisma';

const schema: FastifySchema = {
  description:
    'Remove a user webhook (a webhook triggered for each file uploading, uploaded, or downloading).',
  params: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'The HiberFile user id.' },
      webhookId: { type: 'number', description: 'The webhook id.' },
    },
  },
  querystring: {
    type: 'object',
    properties: {
      webhookType: {
        type: 'string',
        enum: ['newFileUploading', 'newFileUploaded', 'newFileDownloading'],
      },
      url: {
        description: 'The url of the webhook.',
        type: 'string',
      },
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
      description: 'The webhook has been removed.',
    },
  },
};

interface IQuerystring {}
interface IParams {
  id: string;
  webhookId: string;
}
interface IBody {}
interface IHeaders {
  authorization: string;
}

const route: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post<{
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

      if (await prisma.webhook.count({
        where: { id: parseInt(request.params.webhookId) }
      }) === null) return reply.notFound('The webhook was not found.');

      await prisma.webhook.delete({
        where: { id: parseInt(request.params.webhookId) }
      })

      return reply.send();
    }
  );
};

export default route;
