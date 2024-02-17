import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeORMExceptionFilter implements ExceptionFilter {
  private static readonly DEFAULT_MESSAGE = 'Unhandled Database error';

  private readonly logger = new Logger(TypeORMExceptionFilter.name);

  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    this.logger.error(exception.message);

    res.status(HttpStatus.BAD_REQUEST).json({ message: TypeORMExceptionFilter.DEFAULT_MESSAGE });
  }
}
