import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class SuperAdminService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}
  async onModuleInit() {
    await this.createSuperAdmin();
  }
  async createSuperAdmin() {
    const findSuperAdmin = await this.prisma.users.findFirst({
      where: { role: 'superadmin' },
    });
    if (findSuperAdmin) return;
    const hashedPassword = await bcrypt.hash(
      process.env.SUPERADMIN_PASSWORD!,
      10,
    );
    await this.prisma.users.create({
      data: {
        username: process.env.SUPERADMIN_USERNAME!,
        email: process.env.SUPERADMIN_EMAIL!,
        password_hash: hashedPassword,
        role: 'superadmin',
      },
    });
  }
  async createAdminById(id: number) {
    const findUser = await this.prisma.users.findUnique({ where: { id } });
    if (!findUser) throw new BadRequestException('Bunday id li user topilmadi');
    if (findUser.role === 'admin')
      throw new BadRequestException(
        `${id} id li foydalanuvchi allaqachion admin rolida`,
      );
    await this.prisma.users.update({ where: { id }, data: { role: 'admin' } });
    return { message: `${id} id li userga admin roli tayinlandi` };
  }
  async getAllUsers() {
    return await this.prisma.users.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        created_at: true,
        avatar_url: true,
      },
    });
  }
  async getAllAdmins() {
    return await this.prisma.users.findMany({ where: { role: 'admin' } });
  }
}
