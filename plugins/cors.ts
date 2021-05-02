'use strict';

import fp from 'fastify-plugin';
import fc from 'fastify-cors';

/**
 * This plugins adds some utilities to configure CORS
 *
 * @see https://github.com/fastify/fastify-cors
 */
export default fp(async function (fastify, opts) {
	fastify.register(fc, {
		origin: [/localhost:\d+$/, /\.?hiberfile\.com$/],
		methods: ['GET', 'POST'],
		allowedHeaders: ['Content-Type']
	});
});
