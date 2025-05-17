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
import { UserSubscriptionService } from './user-subscription.service';
import { CreateUserSubscriptionDto } from './dto/create-user-subscription.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { userPayload } from 'src/common/interfaces/request.user.interface';

@UseGuards(AuthGuard)
@Controller('user-subscription')
export class UserSubscriptionController {
  constructor(
    private readonly userSubscriptionService: UserSubscriptionService,
  ) {}
  @Get('my-subscriptions')
  async getMySubscriptions(@CurrentUser() user: userPayload) {
    return await this.userSubscriptionService.getMySubscriptionPlans(user);
  }
  @Post('subscription')
  async subscriptionWithPayment(
    @Body() createUserSubscriptionDto: CreateUserSubscriptionDto,
    @CurrentUser() user: userPayload,
  ) {
    return await this.userSubscriptionService.subscriptionWithPayment(
      user,
      createUserSubscriptionDto.plan_id,
    );
  }
}
