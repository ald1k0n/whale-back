import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { User } from '../modules/user/schema';
import { UnauthorizedError } from '../lib/error';

export const AuthGuard = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers['authorization']?.split(' ')[1];
	if (!token) {
		throw new UnauthorizedError();
	}

	try {
		const decoded = verify(token, process.env.JWT_KEY as string) as unknown;

		req.user = decoded as User;
		next();
	} catch (error) {
		throw new UnauthorizedError();
	}
};
