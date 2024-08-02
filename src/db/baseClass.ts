// src/repositories/BaseRepository.ts

import {
	Repository,
	DataSource,
	EntityTarget,
	DeepPartial,
	ObjectLiteral,
	FindOptionsWhere,
} from 'typeorm';

export class BaseRepository<T extends ObjectLiteral> {
	private repository: Repository<T>;

	constructor(dataSource: DataSource, entity: EntityTarget<T>) {
		this.repository = dataSource.getRepository(entity);
	}

	async findOne(id: number): Promise<T | null> {
		return await this.repository.findOneBy({ id } as NonNullable<unknown>);
	}

	async findOneBy(findOptions: FindOptionsWhere<T>): Promise<T | null> {
		return await this.repository.findOneBy(findOptions);
	}

	async findAll(): Promise<T[]> {
		return await this.repository.find();
	}

	async create(data: DeepPartial<T>): Promise<T> {
		const entity = this.repository.create(data);
		return await this.repository.save(entity);
	}

	async update(id: number, data: DeepPartial<T>): Promise<T | null> {
		await this.repository.update(id, data as NonNullable<unknown>);
		return await this.findOne(id);
	}

	async delete(id: number): Promise<void> {
		await this.repository.delete(id);
	}
}
