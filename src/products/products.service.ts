import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { response } from 'src/utils/response.util';

@Injectable()
export class ProductsService {
  constructor(
    // dependency injection -> accessing repository (interact with the queries)
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    if (
      !createProductDto.name ||
      !createProductDto.price ||
      createProductDto.price <= 0 ||
      !createProductDto.stock ||
      !createProductDto.categoryName
    )
      throw new BadRequestException(
        'Please fill out all fields (product name, stock, price, and category)',
      );

    const category = await this.categoriesRepository.findOne({
      where: { name: createProductDto.categoryName },
    });

    if (!category) {
      throw new NotFoundException(
        response(false, 'Category is not found', null),
      );
    }

    const existingProduct = await this.productRepository.findOne({
      where: { name: createProductDto.name },
    });

    if (existingProduct) {
      throw new BadRequestException(
        response(false, 'Product with the same name already exists', null),
      );
    }

    const product = this.productRepository.create({
      name: createProductDto.name,
      stock: createProductDto.stock,
      price: createProductDto.price,
      category: category,
    });

    const result = await this.productRepository.save(product);

    return response(true, 'Product has been created successfully', result);
  }

  async findAll() {
    const result = await this.productRepository.find({
      relations: ['category'],
    });
    return response(true, 'Fetching all products', result);
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(
        response(false, 'Product is not found', null),
      );
    }

    return response(true, 'Fetching product', product);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(
        response(false, 'Product is not found', null),
      );
    }

    Object.assign(product, updateProductDto);

    const result = await this.productRepository.save(product);
    return response(true, `Product has been updated successfully`, result);
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) {
      throw new NotFoundException(
        response(false, 'Product is not found', null),
      );
    }
    await this.productRepository.remove(product);
    return response(
      true,
      `Product with ID ${id} has been removed successfully`,
      product,
    );
  }
}
