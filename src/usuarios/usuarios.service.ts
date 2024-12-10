import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/usuarios/entities/usuario.entity';
import { CreateUserDto } from 'src/usuarios/dto/create-usuario.dto';
import { BadRequestException } from '@nestjs/common';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password, role } = createUserDto;

    // Verificar si username o email ya existen
    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });
    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Hashear la contraseña
    const password_hash = await bcrypt.hash(password, 10);

    // Crear usuario con rol predeterminado 'user' si no se especifica
    const user = this.userRepository.create({
      username,
      email,
      password_hash,
      role: role || 'user',
    });

    // Guardar el usuario en la base de datos
    return this.userRepository.save(user);
  }

  async login(identifier: string, password: string): Promise<{ token: string; user: Partial<User> }> {
    const user = await this.userRepository.findOne({
      where: [{ username: identifier }, { email: identifier }],
    });
  
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    // Generar el token JWT
    const secretKey = process.env.JWT_SECRET || 'default_secret'; // Usar variable de entorno
    const token = jwt.sign(
      {
        username: user.username,
        email: user.email,
        role: user.role,
      },
      secretKey,
      { expiresIn: '1h' }, // Tiempo de expiración
    );
  
    return {
      token,
      user: { username: user.username, email: user.email, role: user.role }, // Información básica
    };
  }

  async changePassword(username: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { username } });
  
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
  
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid current password');
    }
  
    // Validar que la nueva contraseña cumpla con ciertas reglas, si es necesario
    if (currentPassword === newPassword) {
      throw new BadRequestException('New password must be different from the current password');
    }
  
    user.password_hash = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);
  }

  async changeRole(adminUsername: string, targetUsername: string, newRole: string): Promise<void> {
    const adminUser = await this.userRepository.findOne({ where: { username: adminUsername } });
    if (adminUser.role !== 'admin') throw new UnauthorizedException('Only admins can change roles');

    const targetUser = await this.userRepository.findOne({ where: { username: targetUsername } });

    targetUser.role = newRole;
    await this.userRepository.save(targetUser);
  }

}
