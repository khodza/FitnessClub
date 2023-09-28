import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageService } from 'src/image.service';
import { ProductsController } from './product.controller';
import { ProductsService } from './product.service';
import { ProductCategorySchema, ProductSchema } from './product.schema';
import { EquipController } from './equip.controller';
import { CategoriesService } from './category.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    MongooseModule.forFeature([
      { name: 'ProductCategory', schema: ProductCategorySchema },
    ]),
  ],
  controllers: [ProductsController, EquipController],
  providers: [
    ProductsService,
    CategoriesService,
    {
      provide: 'ProductImageService',
      useFactory: () => {
        return new ImageService('products');
      },
    },
  ],
})
export class ProductsModule {}
