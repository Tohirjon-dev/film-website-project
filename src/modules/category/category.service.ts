import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const findCategory = await this.prisma.categories.findUnique({
      where: { slug: createCategoryDto.slug },
    });
    if (findCategory)
      throw new ConflictException('Bu kategoriya allaqachon mavjud');
    const newCategory = await this.prisma.categories.create({
      data: createCategoryDto,
    });
    return {
      message: 'Kategoriya mubvafaqiyatli yaratildi',
      category_id: newCategory.id,
    };
  }

  async findAll() {
    return await this.prisma.categories.findMany();
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const findCategory = await this.prisma.categories.findUnique({
      where: { id },
    });
    await this.prisma.categories.update({
      where: { id },
      data: {
        name: updateCategoryDto.new_name,
        description: updateCategoryDto.new_description,
      },
    });
    return {
      message: 'Kategoriya muvafaqiyatli yangilandi',
    };
  }

  async delete(id: number) {
    const findCategory = await this.prisma.categories.findUnique({
      where: { id },
    });
    if (!findCategory)
      throw new NotFoundException('BundAY ID LI kategoriya topilmadi');
    await this.prisma.categories.delete({ where: { id } });
    return {
      message: "Kategoriya o'chirib yuborildi",
    };
  }
  async searchBySlug(slug: string) {
    return await this.prisma.$queryRaw`
    SELECT * FROM categories
    WHERE slug ILIKE ${'%' + slug + '%'}
    `;
  }
}
