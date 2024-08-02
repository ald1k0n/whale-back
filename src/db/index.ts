import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../modules/user/schema';

// src/create-database.ts

import { Client } from 'pg';

const createDatabase = async () => {
	const client = new Client({
		user: 'postgres',
		host: 'localhost',
		password: '264166',
		port: 5432,
	});

	try {
		await client.connect();
		const res = await client.query(
			'SELECT 1 FROM pg_database WHERE datname = $1',
			['whale-app']
		);
		if (res.rowCount === 0) {
			await client.query('CREATE DATABASE "whale-app"');
			console.log('Database "whale-app" created successfully!');
		} else {
			console.log('Database "whale-app" already exists.');
		}
	} catch (err) {
		console.error('Error creating database:', err);
	} finally {
		await client.end();
	}
};

createDatabase();

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'postgres',
	password: '264166',
	database: 'whale-app',
	synchronize: true,
	logging: false,
	entities: [User],
	migrations: [],
	subscribers: [],
});
