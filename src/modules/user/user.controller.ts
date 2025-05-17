import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { userPayload } from 'src/common/interfaces/request.user.interface';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return await this.userService.register(body);
  }
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.userService.login(body);
    res.cookie('AuthToken', data.token, {
      httpOnly: true,
    });
    return { message: data.message };
  }
  @UseGuards(AuthGuard)
  @Get('me')
  async myProfile(@CurrentUser() user: userPayload) {
    return await this.userService.getMe(user);
  }
  @UseGuards(AuthGuard)
  @Patch('update-password')
  async updatePassword(
    @Body() body: UpdatePasswordDto,
    @CurrentUser() user: userPayload,
  ) {
    return await this.userService.updatePassword(user, body);
  }
}
