import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { MovieFilesService } from './movie-files.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('movie-files')
export class MovieFilesController {
  constructor(private readonly movieFilesService: MovieFilesService) {}
  @Post(':id/upload-files')
  @UseInterceptors(FilesInterceptor('files', 2))
  async uploadMovieFiles(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return await this.movieFilesService.uploadMovieFiles(+id, files);
  }
}
