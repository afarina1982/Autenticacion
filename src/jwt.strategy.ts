// jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from 'src/jwt-payload.interference'; // Ajusta la ruta
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/usuarios/entities/usuario.entity'; // Ajusta la ruta
import { UnauthorizedException } from '@nestjs/common';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secret_key', // Reemplaza con una clave segura en producción
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userRepository.findOne({ where: { username: payload.username } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user; // El usuario estará disponible en req.user
  }
}