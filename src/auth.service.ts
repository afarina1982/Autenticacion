
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/usuarios/entities/usuario.entity';  
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login(identifier: string, password: string): Promise<{ token: string }> {
    const user = await this.userRepository.findOne({
      where: [{ username: identifier }, { email: identifier }],
    });
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = jwt.sign(
      { username: user.username, email: user.email, role: user.role },
      'secret_key', // Cambiar por una clave segura en producción
      { expiresIn: '1h' },
    );
    return { token };
  }
  async validateToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token); // Decodifica y valida el token
    } catch (error) {
      return null; // Token inválido
    }
  }

}
