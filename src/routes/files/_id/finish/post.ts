import { FastifyPluginAsync, FastifySchema } from 'fastify';
import prisma from '../../../../utils/prisma';
import s3 from '../../../../utils/s3';

const schema: FastifySchema = {
  description: 'Report as successfully uploaded.',
  body: {
    type: 'object',
    properties: {
      parts: {
        type: 'array',
        description: 'The results returned from each uploaded chunk.',
        items: {
          type: 'object',
          properties: {
            ETag: { type: 'string' },
            PartNumber: {
              type: 'number',
              description: 'The chunk number associated with the ETag.',
            },
          },
        },
      },
      uploadId: {
        type: 'string',
        description: "The unique id linked to the upload to Amazon's S3.",
      },
      expire: {
        type: 'number',
        description:
          'The time in seconds after which the link will expire. The maximum is 2592000 seconds (30 days).',
      },
    },
  },
  params: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'The HiberFile id.' },
    },
  },
  response: {
    200: {
      type: 'null',
      description: 'The file has been reported as successfully uploaded.',
    },
    400: {
      type: 'null',
      description: 'You have provided too high an expiration time.',
    },
    404: {
      type: 'null',
      description:
        'The file you are trying to access does not exist or has already been uploaded.',
    },
  },
};

interface IQuerystring {}
interface IParams {
  id: string;
}
interface IBody {
  parts: { ETag: string; PartNumber: number }[];
  uploadId: string;
  expire: number;
}
interface IHeaders {}

const route: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post<{
    Querystring: IQuerystring;
    Params: IParams;
    Body: IBody;
    Headers: IHeaders;
  }>('/', { schema }, async (request, reply) => {
    const file = await prisma.file.findUnique({
      where: { hiberfileId: request.params.id },
    });

    if (request.body.expire > 60 * 60 * 24 * 30) return reply.badRequest();
    if (file === null || file.uploading === false) return reply.notFound();

    await prisma.file.update({
      where: { hiberfileId: request.params.id },
      data: {
        uploading: false,
        expire: new Date(new Date().getTime() + request.body.expire * 1000),
      },
    });

    await s3
      .completeMultipartUpload({
        Bucket: 'hiberstorage',
        Key: file.hiberfileId,
        UploadId: request.body.uploadId,
        MultipartUpload: { Parts: request.body.parts },
      })
      .promise();

    return reply.send();
  });
};

export default route;
