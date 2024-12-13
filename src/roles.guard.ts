import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from './roles.decorator'; // Decorador para roles

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true; // Si no se requieren roles, permitir el acceso

    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1]; // Obtener el token del encabezado

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token); // Verificar el token
      if (!requiredRoles.some((role) => payload.role?.includes(role))) {
        throw new UnauthorizedException('User does not have the required role');
      }

      request.user = payload; // Adjuntar el usuario al request
      return true; // Permitir acceso
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
