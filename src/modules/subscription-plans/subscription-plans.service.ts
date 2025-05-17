import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { userPayload } from 'src/common/interfaces/request.user.interface';

@Injectable()
export class SubscriptionPlansService {
  constructor(private prisma: PrismaService) {}
  async createSubscriptionPlan(dto: CreateSubscriptionPlanDto) {
    const findSubscriptionPlan = await this.prisma.subscriptionPlans.findUnique(
      { where: { name: dto.name } },
    );

    const newPlan = await this.prisma.subscriptionPlans.create({
      data: {
        ...dto,
        price: parseFloat(dto.price),
        features: dto.features ? JSON.parse(dto.features) : undefined,
      },
    });
    return {
      message: 'Obuna turi muvafaqiyatli yaratildi',
      plan_id: newPlan.id,
    };
  }
  async getAllPlans() {
    return await this.prisma.subscriptionPlans.findMany();
  }
}
