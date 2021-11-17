import { FastifyPluginAsync, FastifySchema } from 'fastify';
import { resetPassword } from '../../../../utils/emails/emailTemplates';
import sendEmail from '../../../../utils/emails/sendEmail';
import prisma from '../../../../utils/prisma';

require('dotenv').config();

const schema: FastifySchema = {
  description: 'Create a new account.',
  body: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        description: 'The account email.',
      },
      language: {
        type: 'string',
        enum: ['de', 'en', 'es', 'fr', 'it', 'pt'],
        nullable: true,
        description: 'The language of the email.',
      },
    },
  },
  response: {
    200: {
      type: 'null',
    },
  },
};

interface IQuerystring {}
interface IParams {}
interface IBody {
  email: string;
  language?: 'de' | 'en' | 'es' | 'fr' | 'it' | 'pt';
}
interface IHeaders {}

const route: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post<{
    Querystring: IQuerystring;
    Params: IParams;
    Body: IBody;
    Headers: IHeaders;
  }>('/', { schema }, async (request, reply) => {
    const user = await prisma.user.findUnique({
      where: { email: request.body.email },
    });

    if (!user) return reply.notFound('User not found.');

    const resetPasswordId = (await prisma.user.update({
      where: { id: user.id },
      data: {
        reset_password: {
          connectOrCreate: {
            where: { userId: user.id },
            create: {},
          },
        }
      },
      include: {
        reset_password: true
      }
    })).reset_password?.id;

    if (!resetPasswordId) return reply.badRequest('Can\'t request the resetting of the password.')

    await sendEmail(
      user.email,
      resetPassword(request.body.language ?? 'en', `https://hiberfile.com/reset-password/?token=${resetPasswordId}`)
    );

    return reply.send();
  });
};

export default route;
