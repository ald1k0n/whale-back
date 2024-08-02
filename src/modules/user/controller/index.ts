import { Service } from 'typedi';
import { UserService } from '../service';
import { AuthGuard } from '../../../guards';
import { Controller, Post, Put, Get } from '../../../lib/decorators';
import { Request, Response } from 'express';
import { AppDataSource } from '../../../db';
import { User } from '../schema';
import { ValidationError } from '../../../lib/error';

@Controller('/users')
@Service()
export default class UserContoller {
	private readonly userService: UserService;

	constructor() {
		this.userService = new UserService(AppDataSource);
	}

	@Get('/', AuthGuard)
	async test(req: Request, res: Response) {
		return res.send('NICE');
	}

	@Post('/')
	async createUser(req: Request, res: Response) {
		const payload = req.body as User;
		const user = await this.userService.createUser(payload);
		return res.status(201).json(user);
	}

	@Put('/:id', AuthGuard)
	async updateUser(req: Request, res: Response) {
		const { id } = req.params;
		if (!id) throw new ValidationError('id not provided');

		const payload = req.body as Partial<User>;
		const user = await this.userService.updateUser(Number(id), payload);
		return res.status(200).json(user);
	}

	@Post('/sign-in')
	async signIn(req: Request, res: Response) {
		const payload = req.body as Pick<User, 'email' | 'password'>;
		const token = await this.userService.signIn(payload);
		return res.status(200).json({ token });
	}
}
