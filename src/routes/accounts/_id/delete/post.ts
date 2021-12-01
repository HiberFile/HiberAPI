import { FastifyPluginAsync, FastifySchema } from 'fastify';
import prisma from '../../../../utils/prisma';
import bcrypt from 'bcrypt';

const schema: FastifySchema = {
  description: 'Delete an account.',
  params: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'The HiberFile user id.' },
    },
  },
  body: {
    type: 'object',
    properties: {
      currentPassword: {
        type: 'string',
        description: 'The current account password.',
      },
      newPassword: {
        type: 'string',
        description: 'The new account password.',
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
    },
  },
};

interface IQuerystring {}
interface IParams {
  id: string;
}
interface IBody {
  password: string;
}
interface IHeaders {}

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
      if (request.user === undefined || request.user !== request.params.id)
        return reply.unauthorized();

      const user = await prisma.user.findFirst({
        where: { id: parseInt(request.user as string) },
        include: { check_email: true },
      });

      if (user === null) return reply.notFound('User does not exist.');
      if (!user.check_email?.check)
        return reply.unauthorized('Please verify your account.');
      if (!(await bcrypt.compare(request.body.password, user.password)))
        return reply.unauthorized('Bad password.');

      await prisma.$transaction([
        prisma.userEmailChecking.delete({
          where: { userId: user.id },
        }),
        prisma.userWebhooks.deleteMany({
          where: { userId: user.id },
        }),
      ]);

      await prisma.user.delete({
        where: { id: user.id },
      });

      await prisma.file.deleteMany({
        where: { userId: user.id },
      });

      return reply.send();
    }
  );
};

export default route;
