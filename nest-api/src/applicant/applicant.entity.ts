import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('applicants')
export class Applicant {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	level: string;

	@Column()
	language: string;

	@Column()
	categories: string;

	@Column()
	salary: number;

	@Column()
	id_user: number;
}
