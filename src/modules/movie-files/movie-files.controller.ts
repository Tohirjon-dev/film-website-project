import {
  Controller,
  Post,
  Param,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { MovieFilesService } from './movie-files.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { RolesDeco } from 'src/common/decorators/role.decorator';

@UseGuards(AuthGuard, RolesGuard)
@RolesDeco('admin')
@Controller('movie-files')
export class MovieFilesController {
  constructor(private readonly movieFilesService: MovieFilesService) {}

  @Post(':id/upload-video')
  @UseInterceptors(
    FilesInterceptor('files', 1, {
      storage: diskStorage({
        destination: './uploads/film_videos',
        filename: (req, file, cb) => {
          const movieId = req.params.id;
          const ext = extname(file.originalname);

          const filename = `${movieId}-video${ext}`;
          cb(null, filename);
        },
      }),
      limits: {
        fileSize: 100 * 1024 * 1024,
      },
    }),
  )
  async uploadMovieFiles(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return await this.movieFilesService.uploadMovieFiles(+id, files);
  }
  @Post(':id/upload-poster')
  @UseInterceptors(
    FilesInterceptor('file', 1, {
      storage: diskStorage({
        destination: './uploads/film_posters',
        filename: (req, file, cb) => {
          const movieId = req.params.id;
          const ext = extname(file.originalname);
          const filename = `${movieId}-poster${ext}`;
          cb(null, filename);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  async uploadMoviePoster(
    @Param('id') id: string,
    @UploadedFiles() file: Express.Multer.File[],
  ) {
    return await this.movieFilesService.uploadMoviePoster(+id, file);
  }
}
