import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class positions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  company: string;

  @Column()
  category: string;

  @Column()
  level: string;

  @Column()
  language: string;

  @Column()
  description: string;

  @Column()
  salary: number;

  @Column()
  id_user: number;
}