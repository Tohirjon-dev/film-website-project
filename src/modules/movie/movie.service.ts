import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { userPayload } from 'src/common/interfaces/request.user.interface';

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
}
