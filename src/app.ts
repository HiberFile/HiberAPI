import { join } from 'path';
import AutoLoad, { AutoloadPluginOptions } from 'fastify-autoload';
import { FastifyPluginAsync } from 'fastify';
import cron from 'node-cron';
import prisma from './utils/prisma';
import s3 from './utils/s3';

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Place here your custom code!
  cron.schedule('0 * * * *', async () => {
    const expiredFiles = await prisma.file.findMany({
      where: { expire: { lte: new Date() } }
    });

    await prisma.fileWebhooks.deleteMany({
      where: { file: { id: { in: expiredFiles.map(file => file.id) } } }
    });

    await prisma.file.deleteMany({
      where: { id: { in: expiredFiles.map(file => file.id) } }
    });

    const allFilesInS3 = await s3.listObjectsV2({
      Bucket: 'hiberstorage',
    }).promise();

    const allFilesInDB = await prisma.file.findMany();

    let expiredFilesId = expiredFiles.map(file => file.hiberfileId);
    allFilesInS3.Contents?.forEach(s3File => {
      if (!allFilesInDB.find(dbFile => dbFile.hiberfileId === s3File.Key) && s3File.Key) {
        expiredFilesId.push(s3File.Key);
        return;
      }
    });

    console.log('The following files should be deleted soon: ', expiredFiles);

    for (const expiredFileIdsChunked of expiredFilesId.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / 1000);

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [] as (typeof expiredFilesId);
      }

      resultArray[chunkIndex].push(item);

      return resultArray;
    }, [] as (typeof expiredFilesId)[])) {
      try {
        const deleteObjectsRes = await s3.deleteObjects({
          Bucket: 'hiberstorage',
          Delete: {
            Objects: expiredFileIdsChunked.map((fileId) => {
              return { Key: fileId };
            })
          }
        }).promise();

        console.log(deleteObjectsRes);
      } catch (err) {
        console.log('Failed to delete the following files: ', expiredFileIdsChunked);
        console.log(err);
      }
    }
  });

  fastify.setSerializerCompiler(() => (data) => JSON.stringify(data));

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts,
    routeParams: true
  });
};

export default app;
export { app };
