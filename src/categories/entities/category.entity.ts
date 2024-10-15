import { InjectRepository } from '@nestjs/typeorm';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
// category is an entity
export class Category {
  @PrimaryGeneratedColumn()
  // id is primary generated column entity -> auto generated
  id: number;

  @Column()
  //
  name: string;
}
