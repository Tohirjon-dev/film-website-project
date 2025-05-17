import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { RolesDeco } from 'src/common/decorators/role.decorator';

@UseGuards(AuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(RolesGuard)
  @RolesDeco('admin')
  @Post('create')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }

  @Get('all')
  async getAll() {
    return await this.categoryService.findAll();
  }
  @UseGuards(RolesGuard)
  @RolesDeco('admin')
  @Patch('update/:id')
  updateById(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }
  @UseGuards(RolesGuard)
  @RolesDeco('admin')
  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.categoryService.delete(+id);
  }
  @Get('search')
  async searchBySlug(@Query('slug') slug: string) {
    return await this.categoryService.searchBySlug(slug);
  }
}
