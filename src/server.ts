import { AppDataSource } from './db/';
import { config } from 'dotenv';
import cors from 'cors';

import { App } from './lib/app';
import { loggerMiddleware } from './lib/middlewares/logger';
import './modules/user';
config();
AppDataSource.initialize()
	.then(() => console.log('Connected'))
	.catch(console.error);

const app = new App({
	middleWares: [loggerMiddleware, cors()],
	port: 8080,
	prefix: '/api/',
});

app.listen();
