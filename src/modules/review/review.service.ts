import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { userPayload } from 'src/common/interfaces/request.user.interface';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}
  async createOrUpdateRewiew(
    createReviewDto: CreateReviewDto,
    movie_id: number,
    user: userPayload,
  ) {
    const findWatchHistory = await this.prisma.watchHistory.findFirst({
      where: { user_id: user.id, movie_id },
    });
    if (!findWatchHistory)
      throw new BadRequestException(
        'Filmga sharx yozishdan oldin uni tomosha qiling',
      );
    const findReview = await this.prisma.reviews.findFirst({
      where: { user_id: user.id, movie_id },
    });
    if (!findReview) {
      await this.prisma.reviews.create({
        data: { ...createReviewDto, user_id: user.id, movie_id },
      });
      return {
        message: "Sharx muvafaqiyatli qo'shildi",
      };
    } else {
      await this.prisma.reviews.update({
        where: { id: findReview.id },
        data: createReviewDto,
      });
      return {
        message: 'Sharx muvafaqiyatli yangilandi',
      };
    }
  }
  async deleteReview(movie_id: number, user: userPayload) {
    const findReview = await this.prisma.reviews.findFirst({
      where: { user_id: user.id, movie_id },
    });
    if (!findReview)
      throw new BadRequestException('Bu filmga sharx qoldirmagansiz');
    await this.prisma.reviews.delete({ where: { id: findReview.id } });
    return {
      message: "Sharx o'chirib yuborildi",
    };
  }
}
