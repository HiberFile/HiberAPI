import { FastifyPluginAsync, FastifySchema } from 'fastify';
import prisma from '../../../utils/prisma';
import bcrypt from 'bcrypt';

const schema: FastifySchema = {
  description: 'Change the account password.',
  body: {
    type: 'object',
    properties: {
      resetPasswordToken: {
        type: 'string',
        description: 'The reset password token got by email.',
      },
      newPassword: {
        type: 'string',
        description: 'The new account password.',
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
  resetPasswordToken: string;
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
    { schema },
    async (request, reply) => {
      const userResetPassword = await prisma.userResetPassword.findFirst({
        where: { id: request.body.resetPasswordToken, },
        include: { user: { include: { check_email: true } } }
      });

      if (userResetPassword === null) return reply.notFound('Cannot find the requesting of password resetting.');

      const user = userResetPassword.user;

      if (!user.check_email?.check)
        return reply.unauthorized('Please verify your account.');

      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: await bcrypt.hash(request.body.newPassword, 12),
          reset_password: { delete: true },
        },
      });

      return reply.send();
    }
  );
};

export default route;
