import { FastifyPluginAsync, FastifySchema } from 'fastify';
import prisma from '../../../utils/prisma';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { generateEmail } from '../../../utils/generateEmail/generateEmail';

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
      password: {
        type: 'string',
        description: 'The account password.',
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
  password: string;
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
    if (
      (await prisma.user.findUnique({
        where: { email: request.body.email },
      })) !== null
    )
      return reply.conflict('The email address entered is already in use.');

    const user = await prisma.user.create({
      data: {
        email: request.body.email,
        password: await bcrypt.hash(request.body.password, 12),
        check_email: { create: {} },
      },
      include: { check_email: true },
    });

    if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: true,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PW,
        },
      });

      const email = generateEmail(
        request.body.language ?? 'en',
        `https://api.hiberfile.com/accounts/${user.id}/confirmation?confirmation_token=${user.check_email?.id}`
      );

      transporter.sendMail({
        from: '"HiberFile" <hiberfile@hiberfile.com>',
        to: user.email,
        subject: email.subject,
        html: email.html,
      });
    }

    return reply.send();
  });
};

export default route;
