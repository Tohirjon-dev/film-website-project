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
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { userPayload } from 'src/common/interfaces/request.user.interface';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@UseGuards(AuthGuard)
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('create/:id')
  async createOrUpdateRewiew(
    @Body() createReviewDto: CreateReviewDto,
    @Param('id') id: string,
    @CurrentUser() user: userPayload,
  ) {
    return await this.reviewService.createOrUpdateRewiew(
      createReviewDto,
      +id,
      user,
    );
  }
  @Delete('delete/:id')
  async deleteReview(
    @Param('id') id: string,
    @CurrentUser() user: userPayload,
  ) {
    return await this.reviewService.deleteReview(+id, user);
  }
}
