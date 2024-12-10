
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/usuarios/entities/usuario.entity';  
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService, // Usamos el JwtService de NestJS
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Método de login
  async login(identifier: string, password: string): Promise<{ token: string }> {
    // Buscar el usuario por username o email
    const user = await this.userRepository.findOne({
      where: [{ username: identifier }, { email: identifier }],
    });

    // Si el usuario no existe o la contraseña es incorrecta, lanzar error
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Crear el payload del token (incluye el rol)
    const payload = { username: user.username, email: user.email, role: user.role };

    // Generar el token con JwtService
    const token = this.jwtService.sign(payload, {
      secret: 'secret_key', // Asegúrate de cambiar la clave en producción
      expiresIn: '1h', // Expiración del token
    });

    return { token };
  }

  // Método para validar el token
  async validateToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token); // Verifica y decodifica el token
    } catch (error) {
      return null; // Si el token es inválido, retornar null
    }
  }
}
