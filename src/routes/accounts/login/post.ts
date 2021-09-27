import { FastifyPluginAsync, FastifySchema } from 'fastify';
import prisma from '../../../utils/prisma';
import bcrypt from 'bcrypt';

const schema: FastifySchema = {
  description: 'Login to an account.',
  body: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        description: 'The account email.',
      },
      password: {
        type: 'string',
        description: 'The account password.',
      },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          description: 'The authentication token.',
        },
        // expiresIn: {
        //   type: 'number',
        //   description:
        //     'The number of milliseconds before the token is no longer valid.',
        // },
      },
    },
  },
};

interface IQuerystring {}
interface IParams {}
interface IBody {
  email: string;
  password: string;
}
interface IHeaders {}

const route: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post<{
    Querystring: IQuerystring;
    Params: IParams;
    Body: IBody;
    Headers: IHeaders;
  }>('/', { schema }, async (request, reply) => {
    const user = await prisma.user.findFirst({
      where: { email: request.body.email },
      include: { check_email: true },
    });

    if (user === null) return reply.notFound('User does not exist.');
    if (!user.check_email?.check)
      return reply.unauthorized('Please verify your account.');
    if (!(await bcrypt.compare(request.body.password, user.password)))
      return reply.unauthorized('Bad password.');

    return reply.send({
      token: fastify.jwt.sign(user.id.toString()),
      // expiresIn: new Date().getTime() + 3_600_000,
    });
  });
};

export default route;
