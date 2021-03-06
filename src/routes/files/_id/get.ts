import axios from 'axios';
import { FastifyPluginAsync, FastifySchema } from 'fastify';
import prisma from '../../../utils/prisma';
import s3 from '../../../utils/s3';

const schema: FastifySchema = {
  description: 'Download a file.',
  params: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'The HiberFile id.' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        downloadUrl: {
          type: 'string',
          description:
            'A pre-signed url to download the file directly from the S3. The link expires in 30 minutes.',
        },
        filename: { type: 'string', description: 'The name of the file.' },
        expire: {
          type: 'string',
          format: 'date-time',
          description: 'The expiration date of the file.',
        },
      },
    },
    404: {
      type: 'null',
      description:
        'The file you are trying to access does not exist. The id is not correct.',
    },
    425: {
      type: 'null',
      description:
        'The file you are trying to access is not yet downloaded. You must wait before trying again.',
    },
  },
};

interface IQuerystring {}
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
  }>(
    '/',
    { schema, preValidation: [fastify.authenticate] },
    async (request, reply) => {
      const file = await prisma.file.findUnique({
        where: { hiberfileId: request.params.id },
        include: {
          webhooks: { include: { downloading: true } },
          user: {
            include: { webhooks: { include: { newFileDownloading: true } } },
          },
        },
      });

      if (file === null) return reply.notFound();
      if (file.uploading) return reply.code(425).send();
      if (file.private && file.user?.id !== parseInt(request.user as string))
        return reply.unauthorized();

      try {
        await s3
          .headObject({ Bucket: 'hiberstorage', Key: file.hiberfileId })
          .promise();
      } catch {
        return reply.notFound();
      }

      const downloadUrl = await s3.getSignedUrlPromise('getObject', {
        Bucket: 'hiberstorage',
        Key: file.hiberfileId,
        Expires: 60 * 30,
        ResponseContentDisposition: `attachment; filename ="${file.name}"`,
      });

      [
        ...(file.webhooks?.downloading ?? []),
        ...(file.user?.webhooks?.newFileDownloading ?? []),
      ].forEach((webhook) => {
        try {
          axios.post(webhook.url, {
            hiberfileId: request.params.id,
            name: file.name,
            expireIn: (file.expire.getTime() - new Date().getTime()) / 1000,
            downloadUrl,
          }, { maxRedirects: 0 });
        } catch (error) {
          console.error(error);
        }
      });

      return reply.send({
        downloadUrl,
        filename: file.name,
        expire: file.expire,
      });
    }
  );
};

export default route;
