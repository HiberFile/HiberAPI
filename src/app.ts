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

    console.log('The following files should be deleted soon: ', expiredFiles);

    for (const expiredFilesChunked of expiredFiles.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / 1000);

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [] as (typeof expiredFiles);
      }

      resultArray[chunkIndex].push(item);

      return resultArray;
    }, [] as (typeof expiredFiles)[])) {
      s3.deleteObjects({
        Bucket: 'hiberstorage',
        Delete: {
          Objects: expiredFilesChunked.map((file) => {
            return { Key: file.hiberfileId };
          })
        }
      })
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
