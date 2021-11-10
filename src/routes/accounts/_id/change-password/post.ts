import { FastifyPluginAsync, FastifySchema } from 'fastify';
import prisma from '../../../../utils/prisma';
import bcrypt from 'bcrypt';

const schema: FastifySchema = {
  description: 'Change the account password.',
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
  headers: {
    authorization: {
      type: 'string',
      description: 'Basic <your_token>',
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
  currentPassword: string;
  newPassword: string;
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
      console.log(request.user);

      if (request.user === undefined || request.user !== request.params.id)
        return reply.unauthorized();

      const user = await prisma.user.findFirst({
        where: { id: parseInt(request.user as string) },
        include: { check_email: true },
      });

      if (user === null) return reply.notFound('User does not exist.');
      if (!user.check_email?.check)
        return reply.unauthorized('Please verify your account.');
      if (!(await bcrypt.compare(request.body.currentPassword, user.password)))
        return reply.unauthorized('Bad password.');

      await prisma.user.update({
        where: { id: user.id },
        data: { password: await bcrypt.hash(request.body.newPassword, 12) },
      });

      return reply.send();
    }
  );
};

export default route;
