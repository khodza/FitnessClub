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
import { ProductsService } from './product.service';
import { UpdateProductDto } from './dto/product-dtos/update-product.dto';
import { CreateEquipDto } from './dto/equip-dtos/create-equip.dto';
import { CategoriesService } from './category.service';
import { ProductType } from './types';
import { CreateEquipCategoryDto } from './dto/equip-dtos/create-equip-category.dto';
import { DeleteProductsDto } from './dto/delete-product.dto';

@Controller('equipments')
export class EquipController {
  private readonly productType = ProductType.Equip;
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  //Categories

  //Create Category [admin]
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('category')
  createCategory(@Body() createCategoryDto: CreateEquipCategoryDto) {
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

  // Equipments

  //Create Equipment [admin]
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  createEquip(
    @UploadedFile() avatarFile: Express.Multer.File,
    @Body() createEquipDto: CreateEquipDto,
  ) {
    return this.productsService.createProduct(createEquipDto, avatarFile);
  }

  //Get All Equipment [admin,user]
  @UseGuards(JwtAuthGuard)
  @Get()
  findAllEquipments() {
    return this.productsService.findAllProducts(this.productType);
  }

  //Get Avatar of Equipment [admin,user]
  @UseGuards(JwtAuthGuard)
  @Get('images/:filename')
  async getEquipImage(
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
  findEquip(@Param() params: ID) {
    return this.productsService.findProduct(params.id, this.productType);
  }

  //Update Product [admin]
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  updateEquip(
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

  //DELETE USER [admin]
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  removeEquip(@Param() params: ID) {
    return this.productsService.removeProduct(params.id, this.productType);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete()
  removeManyEquips(@Body() body: DeleteProductsDto) {
    return this.productsService.removeManyProducts(
      body.products,
      this.productType,
    );
  }
}
