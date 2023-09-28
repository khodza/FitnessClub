import {
  Injectable,
  BadRequestException,
  Inject,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { ImageService } from 'src/image.service';
import { Readable } from 'stream';
import { CreateProductDto } from './dto/product-dtos/create-product.dto';
import { UpdateProductDto } from './dto/product-dtos/update-product.dto';
import { Product } from './product.schema';
import { CreateEquipDto } from './dto/equip-dtos/create-equip.dto';
import { ProductType } from './types';

@Injectable()
export class ProductsService {
  private readonly log = new Logger(ProductsService.name);
  constructor(
    @InjectModel(Product.name)
    private readonly ProductModel: Model<Product>,
    @Inject('ProductImageService')
    private readonly imageService: ImageService,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto | CreateEquipDto,
    avatarFile?: Express.Multer.File,
  ): Promise<Product> {
    try {
      if (avatarFile) {
        const avatar = await this.imageService.uploadImage(avatarFile);
        createProductDto.avatar = avatar;
      }
      const newProduct = await this.ProductModel.create(createProductDto);
      this.log.log(`Created Product with ID ${newProduct.id}`);
      return newProduct;
    } catch (err) {
      this.log.error(err);
      if (avatarFile) {
        await this.imageService.deleteImage(createProductDto.avatar);
      }
      throw new BadRequestException(err.message, err);
    }
  }

  async findAllProducts(type: ProductType): Promise<Product[]> {
    try {
      const Products = await this.ProductModel.find({ type });
      this.log.log(`Getting all Products`);
      return Products;
    } catch (err) {
      this.log.error(err);
      throw new BadRequestException(err);
    }
  }

  async findProduct(
    id: mongoose.Types.ObjectId,
    type: ProductType,
    SelFields?: string,
    popFields?: string,
  ): Promise<Product> {
    try {
      const Product = this.ProductModel.findOne({ _id: id, type: type });
      if (SelFields) {
        Product.select(SelFields);
      }
      if (popFields) {
        Product.populate(popFields, '-author');
      }
      const readyProduct = await Product;
      if (!readyProduct) {
        this.log.fatal(`No Product with this ID : ${id}`);
        throw new BadRequestException(`No Product with this ID : ${id}`);
      }
      this.log.log(`Getting Product with ID ${id}`);
      return readyProduct;
    } catch (err) {
      this.log.error(err);
      throw new BadRequestException(err.message, err);
    }
  }

  async getProductImage(filename: string): Promise<Readable> {
    // Get the image stream from the image service
    return this.imageService.getImageStream(filename);
  }

  async updateProduct(
    id: mongoose.Types.ObjectId,
    updateOptions: UpdateProductDto,
    avatarFile?: Express.Multer.File,
  ) {
    try {
      if (avatarFile) {
        const avatar = await this.imageService.uploadImage(avatarFile);
        updateOptions.avatar = avatar;
      }
      const update = await this.ProductModel.updateOne(
        { _id: id },
        updateOptions,
        // { runValidators: true },
      );
      this.log.log(`Updated Product with ID ${id}`);
      if (!update) {
        this.log.fatal(`No Product with this ID : ${id}`);
        throw new BadRequestException(`No Product with this id ${id}`);
      }
      const Product = await this.findProduct(id, updateOptions.type);
      return Product;
    } catch (err) {
      this.log.error(err);
      if (avatarFile) {
        await this.imageService.deleteImage(updateOptions.avatar);
      }
      throw new BadRequestException(err.message, err);
    }
  }

  async removeProduct(
    id: mongoose.Types.ObjectId,
    type: ProductType,
  ): Promise<{ message: string }> {
    try {
      const deletedProduct = await this.ProductModel.findOne({
        _id: id,
        type: type,
      });
      if (!deletedProduct) {
        this.log.fatal(`No Product with this ID : ${id}`);
        throw new BadRequestException(`No Product with this ID : ${id}`);
      }
      await this.ProductModel.deleteOne({ _id: id });
      this.log.log(`Deleted Product with ID ${id}`);

      await this.imageService.deleteImage(deletedProduct.avatar);
      return { message: `Product with ID ${id} has been deleted` };
    } catch (err) {
      throw new BadRequestException(err.message, err);
    }
  }
}
