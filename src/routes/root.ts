'use strict';

import { FastifyInstance } from 'fastify';

export default async function (fastify: FastifyInstance, opts: unknown) {
	fastify.get('/', async function (request, reply) {
		return { root: true };
	});
}
