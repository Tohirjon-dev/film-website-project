import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const timestamp = new Date().toISOString();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Ichki xatolik yuz berdi';

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      message = `Prisma xatosi: ${exception.message}`;
      status = HttpStatus.BAD_REQUEST;
    } else if (exception instanceof Prisma.PrismaClientUnknownRequestError) {
      message = 'Nomalum Prisma xatosi yuz berdi';
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      message = `Prisma validatsiya xatosi: ${exception.message}`;
      status = HttpStatus.BAD_REQUEST;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        message = (exceptionResponse as any).message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      success: false,
      message,
      timestamp,
      statusCode: status,
      path: request.url,
    });
  }
}
