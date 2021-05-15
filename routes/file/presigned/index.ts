'use strict';

const addHours = (date: Date, hours: number) => {
	date.setHours(date.getHours() + hours);
	return date;
};

const addDays = (date: Date, days: number) => {
	date.setDate(date.getDate() + days);
	return date;
};

import { FastifyInstance, RequestBodyDefault } from 'fastify';
import fs from 'fs';
import AWS = require('aws-sdk');
import mariadb = require('mariadb');
import dotenv = require('dotenv');
dotenv.config();

const getRandomInt = (min: number, max: number) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
};

const generateId = (alphabet: string, length: number): string => {
	return Array.from(
		Array(length),
		(_, i) => alphabet[getRandomInt(0, alphabet.length)]
	).join('');
};

const pool = mariadb.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	connectionLimit: 5
});

(async () => {
	const conn = await pool.getConnection();
	await conn.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
	await conn.query(`USE ${process.env.DB_NAME}`);
	await conn.query(`CREATE TABLE IF NOT EXISTS Files(
		id varchar(8) NOT NULL UNIQUE,
		name varchar(256) NOT NULL,
		expire DATETIME
	)`);
	await conn.query(`CREATE TABLE IF NOT EXISTS UploadState(
		id varchar(8) NOT NULL UNIQUE,
		uploaded BOOLEAN NOT NULL DEFAULT 0,
		abort BOOLEAN NOT NULL DEFAULT 0,
		error BOOLEAN NOT NULL DEFAULT 0
	)`);
	await conn.release();
})();

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

export default async (fastify: FastifyInstance, opts: unknown) => {
	fastify.post<{
		Body: {
			expireIn: '1_hour' | '1_day' | '3_days' | '7_days' | '30_days';
			filename: string;
		};
	}>('/', async (request, reply) => {
		const { expireIn: expireInStr, filename } = request.body;

		const currentDate = new Date();
		let expire: Date;
		if (expireInStr === '1_hour') {
			expire = addHours(currentDate, 1);
		} else if (expireInStr === '1_day') {
			expire = addDays(currentDate, 1);
		} else if (expireInStr === '3_days') {
			expire = addDays(currentDate, 3);
		} else if (expireInStr === '7_days' || !expireInStr) {
			expire = addDays(currentDate, 7);
		} else {
			expire = addDays(currentDate, 30);
		}

		const id = generateId(
			'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ1234567890',
			8
		);

		try {
			const conn = await pool.getConnection();
			await conn.query(`USE ${process.env.DB_NAME}`);

			await conn.query('INSERT INTO Files value (?, ?, ?)', [
				id,
				filename,
				expire
			]);

			await conn.query('INSERT INTO UploadState (id) value (?)', [id]);

			await conn.release();

			return reply
				.code(200)
				.header('Content-Type', 'application/json; charset=utf-8')
				.send({
					fileId: id,
					post: await s3.createPresignedPost({
						Bucket: 'hiberstorage',
						Fields: {
							key: id
						},
						Expires: 60 * 60 * 2, // 120min
						Conditions: [
							['content-length-range', 0, 1024 * 1024 * 1024 * 20]
							// { 'x-amz-server-side-encryption': 'AES256' }
						]
					})
				});
		} catch (error) {
			console.log(error);
			return reply
				.code(500)
				.header('Content-Type', 'application/json; charset=utf-8')
				.send({
					error
				});
		}
	});

	fastify.get<{
		Querystring: {
			id: string;
			p?: string;
		};
	}>('/', async (request, reply) => {
		const { id, p } = request.query;

		if (id === undefined)
			return reply
				.code(500)
				.header('Content-Type', 'application/json; charset=utf-8')
				.send({
					error: 'Please provide a file id.'
				});
		else {
			if (fs.existsSync(`/var/www/old/d/${id}`) && p !== undefined)
				return reply.code(200).send({
					redirectTo: `https://old.hiberfile.com/d/${id}?p=${p ? p : 'oldfile'}`
				});

			try {
				await s3
					.headObject({
						Bucket: 'hiberstorage',
						Key: id
					})
					.promise();
			} catch (headErr) {
				if (headErr.code === 'NotFound') {
					return reply.notFound();
				}
			}

			const conn = await pool.getConnection();
			await conn.query(`USE ${process.env.DB_NAME}`);

			interface filesRow {
				id: string;
				name: string;
				expire: Date;
				uploadState: string;
			}
			const row: filesRow = (
				await conn.query('SELECT name, expire FROM Files WHERE id=?', [id])
			)[0];

			if (row === undefined) return reply.notFound();

			let filename: string = row.name;
			const expire: string = row.expire.toISOString();

			if (filename === 'generated_by_hf--to_be_remplaced.zip') {
				filename = `hf_${id}.zip`;
			}

			await conn.release();

			return reply
				.code(200)
				.header('Content-Type', 'application/json; charset=utf-8')
				.send({
					url: await s3.getSignedUrlPromise('getObject', {
						Bucket: 'hiberstorage',
						Key: id,
						Expires: 60 * 60 * 2, // 120min
						ResponseContentDisposition:
							'attachment; filename ="' + filename + '"'
					}),
					filename,
					expire
					// encrypted
				});
		}
	});
};
