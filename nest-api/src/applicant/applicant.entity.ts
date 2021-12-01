import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class applicants {
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