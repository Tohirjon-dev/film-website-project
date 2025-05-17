import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserSubscriptionDto } from './dto/create-user-subscription.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { userPayload } from 'src/common/interfaces/request.user.interface';
import { log } from 'console';

@Injectable()
export class UserSubscriptionService {
  constructor(private prisma: PrismaService) {}
  async getMySubscriptionPlans(user: userPayload) {
    const findPlans = await this.prisma.userSubscriptions.findMany({
      where: { user_id: user.id },
    });
    if (findPlans.length === 0)
      throw new NotFoundException('Sizda obuna mavjud emas');
    return findPlans;
  }

  async subscriptionWithPayment(user: userPayload, planId: number) {
    const exicting = await this.prisma.userSubscriptions.findFirst({
      where: { user_id: user.id, plan_id: planId, status: 'active' },
    });
    if (exicting)
      throw new BadRequestException(
        `Sizda bu obuna xozirda faol,tugash vaqti:${exicting.end_date}`,
      );
    const findPlan = await this.prisma.subscriptionPlans.findUnique({
      where: { id: planId },
    });
    if (!findPlan)
      throw new BadRequestException('Bunday id li tarif mavjud emas');
    const now = new Date();
    const endDate = new Date();
    endDate.setDate(now.getDate() + 30);
    return await this.prisma.$transaction(async (tx) => {
      const subscription = await tx.userSubscriptions.create({
        data: {
          user_id: user.id,
          plan_id: planId,
          start_date: now,
          end_date: endDate,
          status: 'active',
        },
      });
      await tx.payments.create({
        data: {
          user_subscription_id: subscription.id,
          amount: findPlan.price,
          payment_method: 'card',
          payment_details: {
            fake: 'demo-payment-info',
          },
          status: 'completed',
          external_transaction_id: 'DEMO_TXN' + Date.now(),
        },
      });
      return {
        message: "Obuna va to'lov muvafaqiyatli amalaga oshirldi",
        subscription,
      };
    });
  }
}
