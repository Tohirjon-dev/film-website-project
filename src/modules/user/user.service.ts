import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { userPayload } from 'src/common/interfaces/request.user.interface';
import { UpdatePasswordDto } from './dto/update-password.dto';
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}
  async register(dto: RegisterDto) {
    const finsdUser = await this.prisma.users.findUnique({
      where: { email: dto.email },
    });
    if (finsdUser)
      throw new ConflictException("Siz allaqachon ro'yxatdan o'tgansiz");
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newUser = await this.prisma.users.create({
      data: {
        username: dto.username,
        email: dto.email,
        password_hash: hashedPassword,
      },
    });
    return {
      message: "Muvafaqiyatli ro'yxatdan o'tdingiz",
      your_id: newUser.id,
    };
  }
  async login(dto: LoginDto) {
    const finsdUser = await this.prisma.users.findUnique({
      where: { email: dto.email },
    });
    if (!finsdUser) throw new BadRequestException('Email xato kiritildi');
    const checkPassword = await bcrypt.compare(
      dto.password,
      finsdUser.password_hash,
    );
    if (!checkPassword) throw new BadRequestException('Parol xato');
    const token = this.jwt.sign({
      id: finsdUser.id,
      role: finsdUser.role,
      email: finsdUser.email,
    });
    return {
      message: 'Tizimga muvafaqiyatli kirdingiz',
      token,
    };
  }
  async getMe(user: userPayload) {
    return await this.prisma.users.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        email: true,
        created_at: true,
      },
    });
  }
  async updatePassword(user: userPayload, dto: UpdatePasswordDto) {
    const hashedPassword = await bcrypt.hash(dto.new_password, 10);
    await this.prisma.users.update({
      where: { id: user.id },
      data: { password_hash: hashedPassword },
    });
    return {
      message: 'Parol muvafaqiyatli yangilandi',
    };
  }
}
