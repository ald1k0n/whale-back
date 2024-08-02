import 'reflect-metadata';
import { RequestHandler, Router } from 'express';
import { RouteDefinition, Methods } from './type';
import Container from 'typedi';
import { Logger } from '../logger';

export const router = Router();

function createMethodDecorator(method: Methods) {
	return (path: string, ...middlewares: RequestHandler[]) => {
		return (target: NonNullable<unknown>, propertyKey: string): void => {
			if (!Reflect.hasMetadata('routes', target.constructor)) {
				Reflect.defineMetadata('routes', [], target.constructor);
			}

			const routes = Reflect.getMetadata(
				'routes',
				target.constructor
			) as Array<RouteDefinition>;

			routes.push({
				method,
				path,
				methodName: propertyKey,
				middlewares,
			});

			Reflect.defineMetadata('routes', routes, target.constructor);
		};
	};
}
/**
 * HTTP GET method decorator.
 * @param {string} path - The endpoint path.
 * @param {...RequestHandler} middlewares - Optional middlewares to run before the main handler.
 * @returns {MethodDecorator}
 */
export const Get = createMethodDecorator('get');
/**
 * HTTP DELETE method decorator.
 * @param {string} path - The endpoint path.
 * @param {...RequestHandler} middlewares - Optional middlewares to run before the main handler.
 * @returns {MethodDecorator}
 */
export const Delete = createMethodDecorator('delete');
/**
 * HTTP PATCH method decorator.
 * @param {string} path - The endpoint path.
 * @param {...RequestHandler} middlewares - Optional middlewares to run before the main handler.
 * @returns {MethodDecorator}
 */
export const Patch = createMethodDecorator('patch');
/**
 * HTTP POST method decorator.
 * @param {string} path - The endpoint path.
 * @param {...RequestHandler} middlewares - Optional middlewares to run before the main handler.
 * @returns {MethodDecorator}
 */
export const Post = createMethodDecorator('post');
/**
 * HTTP PUT method decorator.
 * @param {string} path - The endpoint path.
 * @param {...RequestHandler} middlewares - Optional middlewares to run before the main handler.
 * @returns {MethodDecorator}
 */
export const Put = createMethodDecorator('put');

/**
 * Class decorator for defining a controller with a specified prefix and optional middlewares.
 *
 * @param {string} prefix - The prefix for all routes defined in the controller.
 * @param {...RequestHandler} controllerMiddlewares - Optional middlewares to run for all routes in the controller.
 * @returns {ClassDecorator} - The class decorator function.
 *
 * @example
 * \@Controller('/api')
 * class MyController {
 *   \@Get('/example')
 *   exampleMethod(req: Request, res: Response) {
 *     res.send('Hello, world!');
 *   }
 * }
 */
export const Controller = (
	prefix: string,
	...controllerMiddlewares: RequestHandler[]
): ClassDecorator => {
	return (target: NonNullable<unknown>) => {
		Reflect.defineMetadata('prefix', prefix, target);
		if (!Reflect.hasMetadata('routes', target)) {
			Reflect.defineMetadata('routes', [], target);
		}

		const routes: Array<RouteDefinition> = Reflect.getMetadata(
			'routes',
			target
		);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const instance = Container.get(target) as InstanceType<any>;
		routes.forEach((route: RouteDefinition) => {
			const logger = new Logger(false);

			logger.info(`[${route.method.toUpperCase()}] ${prefix}${route.path}`);

			const middlewares = route.middlewares
				? [...controllerMiddlewares, ...route.middlewares]
				: controllerMiddlewares;

			if (middlewares.length > 0) {
				router[route.method](
					`${prefix}${route.path}`,
					...middlewares,
					instance[route.methodName].bind(instance)
				);
			} else {
				router[route.method](
					`${prefix}${route.path}`,
					instance[route.methodName].bind(instance)
				);
			}
		});
	};
};
