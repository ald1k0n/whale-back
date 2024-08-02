import express, {
	Application,
	RequestHandler,
	Request,
	Response,
	NextFunction,
} from 'express';
import { router } from './decorators';
import { CustomError } from './error';

/**
 * Interface representing the initialization options for the application.
 * @interface
 */
interface AppInit {
	/**
	 * The port number on which the application will listen.
	 * @type {number}
	 */
	port: number;

	/**
	 * An array of middleware functions to be used by the application.
	 * @type {RequestHandler[]}
	 */
	middleWares: RequestHandler[];

	/**
	 * The path for serving static files. Default is 'public'.
	 * @type {string}
	 * @optional
	 */
	staticPath?: string;

	/**
	 * The prefix for all endpoints. Default is '/'.
	 * @type {string}
	 * @optional
	 */
	prefix?: string;
}

/**
 * Class representing an Express application.
 */
export class App {
	public app: Application;
	private port: number;

	/**
	 * Creates an instance of the App class.
	 * @param {AppInit} appInit - The initialization options for the application.
	 */
	constructor(appInit: AppInit) {
		this.app = express();
		this.app.use(express.json());
		this.port = appInit.port;
		this.middlewares(appInit.middleWares);
		this.statics(appInit.staticPath);
		this.app.use(appInit.prefix ? appInit.prefix : '/', router);
		this.handleError();
	}

	/**
	 * Registers the middleware functions with the Express application.
	 * @param {RequestHandler[]} middleWares - The middleware functions to register.
	 * @private
	 */
	private middlewares(middleWares: RequestHandler[]) {
		middleWares.forEach((middleWare) => {
			this.app.use(middleWare);
		});
	}

	/**
	 * Configures the application to serve static files from the specified path.
	 * @param {string} [path='public'] - The path for serving static files.
	 * @private
	 */
	private statics(path: string = 'public') {
		this.app.use(`/${path}`, express.static('public'));
	}

	/**
	 * Registers the error handling middleware with the Express application.
	 * @private
	 */
	private handleError() {
		this.app.use(
			(err: CustomError, _: Request, res: Response, next: NextFunction) => {
				if (err) {
					const statusCode = err?.statusCode || 500;

					return res.status(statusCode).json({
						status: statusCode,
						message: err?.message,
						name: err.name,
					});
				}
				next();
			}
		);
	}

	/**
	 * Starts the Express application and listens on the specified port.
	 */
	public listen() {
		this.app.listen(this.port, () => {
			console.log(`App listening on port: ${this.port}`);
		});
	}
}
