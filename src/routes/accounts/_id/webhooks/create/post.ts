import { FastifyPluginAsync, FastifySchema } from 'fastify';
import prisma from '../../../../../utils/prisma';

const schema: FastifySchema = {
  description:
    'Add a user webhook (a webhook triggered for each file uploading, uploaded, or downloading).',
  params: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'The HiberFile user id.' },
    },
  },
  body: {
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
      description: 'The webhook has been added.',
    },
  },
};

interface IQuerystring {}
interface IParams {
  id: string;
}
interface IBody {
  webhookType: 'newFileUploading' | 'newFileUploaded' | 'newFileDownloading';
  url: string;
}
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

      if (!request.body.url.startsWith('https://'))
        return reply.badRequest('The url must start with https://');

      if (await prisma.userWebhooks.count({
        where: { userId: user.id }
      }) === 0) {
        await prisma.userWebhooks.create({
          data: {
            userId: user.id,
            [request.body.webhookType]: {
              create: {
                url: request.body.url,
              },
            },
          },
        });
      } else {
        await prisma.userWebhooks.update({
          where: { userId: user.id },
          data: {
            [request.body.webhookType]: {
              create: {
                url: request.body.url,
              },
            },
          },
        })
      }


      return reply.send();
    }
  );
};

export default route;
