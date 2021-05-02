'use strict';

const path = require('path');
const AutoLoad = require('fastify-autoload');
import AWS from 'aws-sdk';
import mariadb from 'mariadb';
import { FastifyInstance } from 'fastify';

export default async function (fastify: FastifyInstance, opts: unknown) {
	// Place here your custom code!

	// Do not touch the following lines

	// This loads all plugins defined in plugins
	// those should be support plugins that are reused
	// through your application
	fastify.register(AutoLoad, {
		dir: path.join(__dirname, 'plugins'),
		options: Object.assign({}, opts)
	});

	// This loads all plugins defined in routes
	// define your routes in one of these
	fastify.register(AutoLoad, {
		dir: path.join(__dirname, 'routes'),
		options: Object.assign({}, opts)
	});
}

AWS.config.getCredentials((err) => {
	if (err) console.log(err.stack);
	// credentials not loaded
	else {
		console.log('Access key:', AWS.config.credentials!.accessKeyId);
	}
});

AWS.config.update({
	signatureVersion: 'version',
	region: 'fr-par'
});

const s3 = new AWS.S3({
	apiVersion: 'latest',
	signatureVersion: 'v4',
	endpoint: 'https://s3.fr-par.scw.cloud'
});

const pool = mariadb.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	connectionLimit: 5
});

setInterval(async () => {
	const conn = await pool.getConnection();
	await conn.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
	await conn.query(`USE ${process.env.DB_NAME}`);

	const expiredObjectsQuery = await conn.query(
		'SELECT id FROM Files WHERE expire < NOW()'
	);

	interface filesRow {
		id: string;
		name: string;
		expire: string;
		uploadState: string;
	}

	const expiredObjects: { Key: string }[] = expiredObjectsQuery.map(
		(row: filesRow) => {
			return {
				Key: row.id
			};
		}
	);

	s3.deleteObjects({
		Bucket: 'hiberstorage',
		Delete: {
			Objects: expiredObjects
		}
	});

	await conn.query('DELETE FROM Files WHERE expire < NOW()');

	await conn.release();
}, 3600 * 1000);
