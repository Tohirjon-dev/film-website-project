import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionPlansService } from './subscription-plans.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { RolesDeco } from 'src/common/decorators/role.decorator';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';

@UseGuards(AuthGuard)
@Controller('subscription-plans')
export class SubscriptionPlansController {
  constructor(
    private readonly subscriptionPlansService: SubscriptionPlansService,
  ) {}
  @UseGuards(RolesGuard)
  @RolesDeco('admin')
  @Post('create')
  async subscriptionPlan(@Body() body: CreateSubscriptionPlanDto) {
    return await this.subscriptionPlansService.createSubscriptionPlan(body);
  }
  @Get('plans')
  async getAllPlans() {
    return await this.subscriptionPlansService.getAllPlans();
  }
}
