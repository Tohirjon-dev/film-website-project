import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { userPayload } from 'src/common/interfaces/request.user.interface';
import { Prisma } from '@prisma/client';
import { Request } from 'express';

@Injectable()
export class MovieService {
  constructor(private prisma: PrismaService) {}
  async createMovie(createMovieDto: CreateMovieDto, user: userPayload) {
    const findMovie = await this.prisma.movies.findUnique({
      where: { slug: createMovieDto.slug },
    });
    if (findMovie)
      throw new BadRequestException("Bu kino allaqachon qo'shilgan");
    const existingCategories = await this.prisma.categories.findMany({
      where: {
        id: {
          in: createMovieDto.categories,
        },
      },
    });
    if (existingCategories.length !== createMovieDto.categories.length)
      throw new BadRequestException(
        "Bazi kategoriyalar noto'g'ri yoki mavjud emas",
      );

    const result = await this.prisma.$transaction(async (prisma) => {
      const newFilm = await prisma.movies.create({
        data: {
          title: createMovieDto.title,
          slug: createMovieDto.slug,
          release_year: createMovieDto.release_year,
          duration_minutes: createMovieDto.duration_minutes,
          description: createMovieDto.description,
          created_by: user.id,
        },
      });
      const movieCategoriesData = createMovieDto.categories.map(
        (categoryId) => ({
          movie_id: newFilm.id,
          category_id: categoryId,
        }),
      );
      await prisma.movieCategories.createMany({ data: movieCategoriesData });
      return newFilm;
    });
    return {
      message: 'Film muvafaqiyatli yaratildi',
      film_id: result.id,
    };
  }
  async getAllFilms() {
    return await this.prisma.movies.findMany();
  }
  async getTopFilms() {
    return await this.prisma.$queryRaw`
    SELECT * from movies
    ORDER BY view_count DESC
    `;
  }
  async searchFilm(text: string) {
    return await this.prisma.$queryRaw`
    SELECT * from movies
    WHERE title ILIKE ${'%' + text + '%'}
    `;
  }
  async deleteFilmById(id: number) {
    const findMovie = await this.prisma.movies.findUnique({ where: { id } });
    if (!findMovie)
      throw new BadRequestException('Bunday id li kino mavjud emas');
    await this.prisma.$transaction(async (prisma) => {
      await prisma.reviews.deleteMany({
        where: { movie_id: id },
      });

      await prisma.movieFiles.deleteMany({
        where: { movie_id: id },
      });

      await prisma.favorites.deleteMany({
        where: { movie_id: id },
      });

      await prisma.watchHistory.deleteMany({
        where: { movie_id: id },
      });

      await prisma.movieCategories.deleteMany({
        where: { movie_id: id },
      });

      await prisma.movies.delete({
        where: { id },
      });
    });
    return {
      message: "Film o'chirib yuborildi",
    };
  }
  async watchMovie(userId: number, movieId: number, req: Request) {
    return this.prisma.$transaction(async (tx) => {
      const subscription = await tx.userSubscriptions.findFirst({
        where: {
          user_id: userId,
          status: 'active',
          end_date: {
            gte: new Date(),
          },
        },
      });

      if (!subscription) {
        throw new ForbiddenException('Sizda faol obuna mavjud emas.');
      }

      const movie = await tx.movies.findUnique({
        where: { id: movieId },
      });

      if (!movie) {
        throw new NotFoundException('Film topilmadi.');
      }

      const file = await tx.movieFiles.findFirst({
        where: { movie_id: movieId },
      });

      if (!file) {
        return {
          message: 'Film tez orada yuklanadi.',
          available: false,
        };
      }
      const existingHistory = await tx.watchHistory.findFirst({
        where: {
          user_id: userId,
          movie_id: movieId,
        },
      });

      if (!existingHistory) {
        await tx.watchHistory.create({
          data: {
            user_id: userId,
            movie_id: movieId,
            watched_duration: 0,
            watched_percentage: new Prisma.Decimal(0),
          },
        });
      }
      await tx.movies.update({
        where: { id: movieId },
        data: {
          view_count: {
            increment: 1,
          },
        },
      });

      return {
        message: 'Tomosha qilish uchun linkni bosing',
        available: true,
        file_url: `/stream${file.file_url.replace(/^\/uploads/, '')}`,
      };
    });
  }
  async downloadMovie(userId: number, movieId: number) {
    return this.prisma.$transaction(async (tx) => {
      const subscription = await tx.userSubscriptions.findFirst({
        where: {
          user_id: userId,
          status: 'active',
          end_date: {
            gte: new Date(),
          },
        },
      });

      if (!subscription) {
        throw new ForbiddenException('Sizda faol obuna mavjud emas.');
      }

      const movie = await tx.movies.findUnique({
        where: { id: movieId },
      });

      if (!movie) {
        throw new NotFoundException('Film topilmadi.');
      }

      const file = await tx.movieFiles.findFirst({
        where: { movie_id: movieId },
      });

      if (!file) {
        return {
          message: 'Film tez orada yuklanadi.',
          available: false,
        };
      }

      const fileUrl = `${file.file_url}`;

      return {
        message:
          'Yuklab olish uchun linkni bosing (brauzerda qidiruv bersangiz yuklab oladi)',
        available: true,
        file_url: fileUrl,
      };
    });
  }
}
