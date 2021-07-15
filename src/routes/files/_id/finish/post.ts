import { FastifyPluginAsync, FastifySchema } from 'fastify';
import prisma from '../../../../utils/prisma';
import s3 from '../../../../utils/s3';

const schema: FastifySchema = {};

interface IQuerystring {}
interface IParams {
  id: string;
}
interface IBody {
  parts: { ETag: string; PartNumber: number }[];
  uploadId: string;
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

    if (file === null || file.uploading === false) return reply.notFound();

    await prisma.file.update({
      where: { hiberfileId: request.params.id },
      data: { uploading: false },
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
