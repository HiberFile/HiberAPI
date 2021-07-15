import { FastifyPluginAsync, FastifySchema } from 'fastify';
import generateId from '../../../utils/generateId';
import prisma from '../../../utils/prisma';
import s3 from '../../../utils/s3';

const schema: FastifySchema = {};

interface IQuerystring {}
interface IParams {}
interface IBody {
  name: string;
  expire: number;
  chunksNumber: number;
}
interface IHeaders {}

const route: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post<{
    Querystring: IQuerystring;
    Params: IParams;
    Body: IBody;
    Headers: IHeaders;
  }>('/', { schema }, async (request, reply) => {
    const hiberfileId = generateId(8);

    const baseParams = { Bucket: 'hiberstorage', Key: hiberfileId };

    const multipartUpload = await s3
      .createMultipartUpload(baseParams)
      .promise();
    const uploadId = multipartUpload.UploadId;

    if (uploadId === undefined) return reply.internalServerError();

    await prisma.file.create({
      data: {
        hiberfileId,
        name: request.body.name,
        expire: new Date(new Date().getTime() + request.body.expire * 1000),
        uploading: true,
      },
    });

    const uploadUrls = await Promise.all(
      Array.from({ length: request.body.chunksNumber }, (_, i) =>
        s3.getSignedUrlPromise('uploadPart', {
          ...baseParams,
          UploadId: uploadId,
          PartNumber: i + 1,
        })
      )
    );

    return reply.send({
      uploadUrls,
      uploadId,
      hiberfileId,
    });
  });
};

export default route;
