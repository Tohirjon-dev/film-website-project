import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { RolesDeco } from 'src/common/decorators/role.decorator';

@UseGuards(AuthGuard, RolesGuard)
@Controller('super-admin')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}
  @Put('create-admin/:id')
  async createAdmin(@Param('id') id: string) {
    return await this.superAdminService.createAdminById(+id);
  }
  @Get('all-users')
  async getAllUsers() {
    return await this.superAdminService.getAllUsers();
  }
  @Get('admins')
  async getAllAdmins() {
    return await this.superAdminService.getAllAdmins();
  }
}
