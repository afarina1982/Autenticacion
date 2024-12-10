import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    console.log('Authorization Header:', request.headers.authorization);
    
    const token = request.headers.authorization?.split(' ')[1]; // Bearer token

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    const user = await this.authService.validateToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    request.user = user; // Agrega el usuario autenticado a la solicitud
    return true;
  }
}
