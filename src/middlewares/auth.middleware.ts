import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DBService } from 'src/common/services/db.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private db: DBService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];
    if (!token) {
      throw new ForbiddenException();
    }

    let uid = '';

    try {
      uid = await this.db.verifyTokenAndGetUID(token);
    } catch (error) {
      throw new InternalServerErrorException('Something bad happened', error);
    }

    if (!uid) {
      throw new ForbiddenException();
    }

    req.uid = uid;
    next();
  }
}
