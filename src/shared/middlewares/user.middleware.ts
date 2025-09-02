import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    try {
      const auth_token =
        req.cookies['auth_token'] || req.headers['authorization'];
      const user = this.jwtService.verify(auth_token);
      if (user && user.exp && user.exp > Date.now()) {
        req['user'] = user;
      }
      next();
    } catch (error) {
      next();
    }
  }
}
