import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ID } from 'src/users/dto/id.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { CreateProductDto } from './dto/product-dtos/create-product.dto';
import { ProductsService } from './product.service';
import { UpdateProductDto } from './dto/product-dtos/update-product.dto';
import { CategoriesService } from './category.service';
import { ProductType } from './types';
import { CreateProductCategoryDto } from './dto/product-dtos/create-product-category.dto';
import { DeleteProductsDto } from './dto/delete-product.dto';

@Controller('products')
export class ProductsController {
  private readonly productType = ProductType.Product;
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  //Categories

  //Create Category [admin]
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('category')
  createCategory(@Body() createCategoryDto: CreateProductCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  //Get All Category [admin,user]
  @UseGuards(JwtAuthGuard)
  @Get('category')
  findAllCategory() {
    return this.categoriesService.findAllCategories(this.productType);
  }

  //Get Category by Id [admin,user]
  @UseGuards(JwtAuthGuard)
  @Get('category/:id')
  findCategory(@Param() params: ID) {
    return this.categoriesService.findCategory(params.id, this.productType);
  }

  //DELETE CATEGORY [admin]
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete('category/:id')
  removeCategory(@Param() params: ID) {
    return this.categoriesService.removeCategory(params.id, this.productType);
  }

  //Products

  //Create Product [admin]
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  createProduct(
    @UploadedFile() avatarFile: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    console.log(createProductDto);
    return this.productsService.createProduct(createProductDto, avatarFile);
  }

  //Get All Product [admin,user]
  @UseGuards(JwtAuthGuard)
  @Get()
  findAllProducts() {
    return this.productsService.findAllProducts(this.productType);
  }

  //Get Avatar of Product [admin,user]
  @UseGuards(JwtAuthGuard)
  @Get('images/:filename')
  async getProductImage(
    @Param('filename') filename: string,
    @Res() res: Response,
  ): Promise<void> {
    // Fetch the image based on the filename and send it in the response
    const imageStream = await this.productsService.getProductImage(filename);

    // Set appropriate headers (e.g., content-type)
    res.setHeader('Content-Type', 'image/png');

    // Pipe the image stream to the response
    imageStream.pipe(res);
  }

  //Get Product by Id [admin,user]
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findProduct(@Param() params: ID) {
    return this.productsService.findProduct(params.id, this.productType);
  }

  //Update Product [admin]
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  updateProduct(
    @Param() params: ID,
    @Body() updateOptions: UpdateProductDto,
    @UploadedFile() avatarFile: Express.Multer.File,
  ) {
    return this.productsService.updateProduct(
      params.id,
      updateOptions,
      avatarFile,
    );
  }

  //DELETE Product [admin]
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  removeProduct(@Param() params: ID) {
    return this.productsService.removeProduct(params.id, this.productType);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete()
  removeManyProducts(@Body() body: DeleteProductsDto) {
    return this.productsService.removeManyProducts(
      body.products,
      this.productType,
    );
  }

  //Search Products [admin,user]
  // @UseGuards(JwtAuthGuard)
  // @Get('search/:query')
  // searchProducts(@Param() params: ID) {
  //   return this.productsService.searchProducts(params.id, this.productType);
  // }
}
