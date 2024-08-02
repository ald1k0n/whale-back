import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { BaseRepository } from '../../../db/baseClass';
import { User } from '../schema';
import { DataSource } from 'typeorm';
import {
	MethodNotAllowed,
	NotFoundError,
	UnauthorizedError,
} from '../../../lib/error';
import { Logger } from '../../../lib/logger';

export class UserService extends BaseRepository<User> {
	private logger = new Logger();
	constructor(dataSource: DataSource) {
		super(dataSource, User);
	}

	private generateToken = (
		payload: Partial<User>,
		expiresIn: string | number
	) => {
		const token = jwt.sign(payload, process.env?.JWT_KEY as string, {
			expiresIn,
		});

		return token;
	};

	public async createUser(payload: Omit<User, 'id'>) {
		const exists = await this.findOneBy({ email: payload.email });

		if (exists) {
			throw new MethodNotAllowed();
		}
		const hashedPassword = await bcrypt.hash(payload.password, 7);

		const user = await this.create({
			...payload,
			password: hashedPassword,
		});

		return user;
	}

	public async signIn(payload: Pick<User, 'email' | 'password'>) {
		const exists = await this.findOneBy({ email: payload.email });

		const { password, ...rest } = exists as User;

		if (!exists) throw new UnauthorizedError();

		const isPasswordValid = await bcrypt.compare(payload.password, password);

		if (!isPasswordValid) throw new UnauthorizedError();

		const token = this.generateToken(rest, '30d');

		return token;
	}

	public async updateUser(
		id: number,
		payload: Partial<User>
	): Promise<User | null> {
		const existingUser = await this.findOne(id);

		if (!existingUser) {
			throw new NotFoundError(`User with ID ${id} not found.`);
		}

		if (payload.password) {
			payload.password = await bcrypt.hash(payload.password, 7);
		}

		const updatedUser = await this.update(existingUser.id, payload);
		return updatedUser;
	}
}
