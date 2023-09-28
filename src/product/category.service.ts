import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { ProductCategory } from './product.schema';
import { ProductType } from './types';
import { CreateProductCategoryDto } from './dto/product-dtos/create-product-category.dto';
import { CreateEquipCategoryDto } from './dto/equip-dtos/create-equip-category.dto';

@Injectable()
export class CategoriesService {
  private readonly log = new Logger(CategoriesService.name);
  constructor(
    @InjectModel(ProductCategory.name)
    private readonly categoryModel: Model<ProductCategory>,
  ) {}

  async createCategory(
    createCategoriesDto: CreateProductCategoryDto | CreateEquipCategoryDto,
  ): Promise<ProductCategory> {
    try {
      const newCategory = await this.categoryModel.create(createCategoriesDto);
      this.log.log(`Created Category with ID ${newCategory.id}`);
      return newCategory;
    } catch (err) {
      this.log.error(err);
      throw new BadRequestException(err.message, err);
    }
  }

  async findAllCategories(type: ProductType): Promise<ProductCategory[]> {
    try {
      const categories = await this.categoryModel.find({ type });
      this.log.log(`Getting all Categories`);
      return categories;
    } catch (err) {
      this.log.error(err);
      throw new BadRequestException(err);
    }
  }

  async findCategory(
    id: mongoose.Types.ObjectId,
    type: ProductType,
  ): Promise<ProductCategory> {
    try {
      const category = this.categoryModel.findById(id, { type });

      const readyCategory = await category;
      if (!readyCategory) {
        this.log.fatal(`No category with this ID : ${id}`);
        throw new BadRequestException(`No category with this ID : ${id}`);
      }
      this.log.log(`Getting category with ID ${id}`);
      return readyCategory;
    } catch (err) {
      this.log.error(err);
      throw new BadRequestException(err.message, err);
    }
  }

  async removeCategory(
    id: mongoose.Types.ObjectId,
    type: ProductType,
  ): Promise<{ message: string }> {
    try {
      const deletedCategory = await this.categoryModel.findOneAndDelete({
        _id: id,
        type: type,
      });
      if (!deletedCategory) {
        this.log.fatal(`No Category with this ID : ${id}`);
        throw new BadRequestException(`No Category with this ID : ${id}`);
      }
      this.log.log(`Deleted Category with ID ${id}`);

      return { message: `Category with ID ${id} has been deleted` };
    } catch (err) {
      throw new BadRequestException(err.message, err);
    }
  }
}
