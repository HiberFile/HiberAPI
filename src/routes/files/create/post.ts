import { FastifyPluginAsync, FastifySchema } from 'fastify';
import generateId from '../../../utils/generateId';
import prisma from '../../../utils/prisma';
import s3 from '../../../utils/s3';

const schema: FastifySchema = {
  description: 'Create an upload request.',
  body: {
    type: 'object',
    properties: {
      chunksNumber: {
        type: 'number',
        description:
          'The number of chunks to upload. The recommended size of a chunk is 10mb.',
      },
      name: {
        type: 'string',
        description:
          'The name of your file. If it is a .zip file and you want to replace the name by the HiberFile id, it should be equal to "generated_by_hf--to_be_remplaced.zip".',
      },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        uploadUrls: {
          type: 'array',
          items: { type: 'string' },
          description:
            'The urls to upload all the chunks (the length is equal to the chunksNumber body property).',
        },
        uploadId: {
          type: 'string',
          description: "The unique id linked to the upload to Amazon's S3.",
        },
        hiberfileId: {
          type: 'string',
          description: 'The unique id used to download the file on HiberFile.',
        },
      },
    },
  },
};

interface IQuerystring {}
interface IParams {}
interface IBody {
  name: string;
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
    const presignedExpire = 12 * 3600;

    const hiberfileId = generateId(8);

    const baseParams = {
      Bucket: 'hiberstorage',
      Key: hiberfileId,
    };

    const multipartUpload = await s3
      .createMultipartUpload(baseParams)
      .promise();
    const uploadId = multipartUpload.UploadId;

    if (uploadId === undefined) return reply.internalServerError();

    await prisma.file.create({
      data: {
        hiberfileId,
        name:
          request.body.name == 'generated_by_hf--to_be_remplaced.zip'
            ? `hf_${hiberfileId}.zip`
            : request.body.name,
        expire: new Date(new Date().getTime() + presignedExpire * 1000),
        uploading: true,
      },
    });

    const uploadUrls = await Promise.all(
      Array.from({ length: request.body.chunksNumber }, (_, i) =>
        s3.getSignedUrlPromise('uploadPart', {
          ...baseParams,
          UploadId: uploadId,
          PartNumber: i + 1,
          Expires: presignedExpire,
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
