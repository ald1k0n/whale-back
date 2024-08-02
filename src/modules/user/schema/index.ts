import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({
		default: null,
	})
	firstName!: string;

	@Column({
		default: null,
	})
	lastName!: string;

	@Column()
	username!: string;

	@Column({ default: null })
	age!: number;

	@Column()
	password!: string;

	@Column()
	email!: string;

	@Column()
	gender!: boolean;

	@Column({
		default: false,
	})
	isPayed?: boolean;

	@Column({
		type: Date,
		default: null,
	})
	payedTimeStamp?: Date;
}
