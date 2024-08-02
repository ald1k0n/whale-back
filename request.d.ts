import { User } from './src/modules/user/schema';

declare global {
	namespace Express {
		export interface Request {
			user?: User;
		}
	}
}
