import { join } from 'path';
import AutoLoad, { AutoloadPluginOptions } from 'fastify-autoload';
import { FastifyPluginAsync } from 'fastify';
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

  fastify.setSerializerCompiler(() => (data) => JSON.stringify(data));

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts,
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts,
    routeParams: true,
  });
};

setInterval(async () => {
  const expiredFiles = await prisma.file.findMany({
    where: { expire: { lte: new Date() } },
  });
  await prisma.file.deleteMany({
    where: { expire: { lte: new Date() } },
  });

  s3.deleteObjects({
    Bucket: 'hiberstorage',
    Delete: {
      Objects: expiredFiles.map((file) => {
        return { Key: file.id.toString() };
      }),
    },
  });
}, 3600 * 1000);

export default app;
export { app };
