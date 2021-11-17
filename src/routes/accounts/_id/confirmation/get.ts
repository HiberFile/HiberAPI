import { FastifyPluginAsync, FastifySchema } from 'fastify';
import prisma from '../../../../utils/prisma';

const schema: FastifySchema = {
  description: 'Confirm the email address.',
  querystring: {
    type: 'object',
    properties: {
      confirmation_token: {
        type: 'string',
        description: 'The confirmation token sent in the email.',
      },
    },
  },
};

interface IQuerystring {
  confirmation_token: string;
}
interface IParams {
  id: string;
}
interface IBody {}
interface IHeaders {}

const route: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get<{
    Querystring: IQuerystring;
    Params: IParams;
    Body: IBody;
    Headers: IHeaders;
  }>('/', { schema }, async (request, reply) => {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(request.params.id as string) },
      include: { check_email: true },
    });

    if (user === null) return reply.redirect('https://hiberfile.com/');

    if (user.check_email?.id === request.query.confirmation_token) {
      await prisma.userEmailChecking.update({
        where: { userId: user.id },
        data: { check: true },
      });
    }

    return reply.redirect('https://hiberfile.com/?source=verification-email');
  });
};

export default route;
