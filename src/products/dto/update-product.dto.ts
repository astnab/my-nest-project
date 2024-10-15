import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// partial type -> allows partial updates, reduces redundant definition
export class UpdateProductDto extends PartialType(CreateProductDto) {}
