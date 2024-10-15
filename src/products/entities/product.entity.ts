import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
// category is an entity
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('int')
  stock: number;

  @Column('decimal', { precision: 10, scale: 0 })
  price: number;

  // relation -> should define product in category entity
  @ManyToOne(() => Category, (category) => category.products)
  category: Category;
}
