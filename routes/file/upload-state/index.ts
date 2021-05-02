'use strict';

import { FastifyInstance, RequestBodyDefault } from 'fastify';

export default async (fastify: FastifyInstance, opts: unknown) => {
	fastify.post('/', async (request, reply) => {
		return reply.notImplemented();
	});

	fastify.get('/', async (request, reply) => {
		return reply.notImplemented();
	});
};
