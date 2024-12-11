import { Controller, Post, Body, Patch, Req } from '@nestjs/common';
import { UsersService } from 'src/usuarios/usuarios.service';  // Asegúrate de que la ruta sea correcta
import { AuthService } from 'src/auth.service';  // Asegúrate de que la ruta sea correcta
import { Param } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { User } from 'src/usuarios/entities/usuario.entity';  // Asegúrate de que la ruta sea correcta
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/usuarios/dto/create-usuario.dto';
import { BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { AuthGuard } from 'src/auth.guard';  // Asegúrate de que la ruta sea correcta
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/admin.guard';

@ApiTags('USERS')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,  // Asegúrate de que este servicio esté correctamente inyectado
  ) {}

//===============================================================================================

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente.',
    type: User, // Asegúrate de que el tipo sea el correcto
  })
  @ApiResponse({
    status: 400,
    description: 'Datos incorrectos. Asegúrate de enviar todos los campos correctamente.',
  })
  @ApiResponse({
    status: 409,
    description: 'El usuario ya existe.',
  })
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.usersService.register(createUserDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('El usuario ya existe');
      }
      throw error;
    }
  }

//===============================================================================================

  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso.',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Credenciales incorrectas.',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado.',
  })
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto.identifier, loginDto.password);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Usuario no encontrado');
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException('Credenciales incorrectas');
      }
      throw error;
    }
  }

//===============================================================================================

  @Patch('password')
  @UseGuards(AuthGuard) // Asegura que el usuario esté autenticado
  @ApiBearerAuth() // Indica que este endpoint requiere un token Bearer
  @ApiBody({
    schema: { 
      properties: { 
        currentPassword: { 
          type: 'string', 
          example: 'oldPassword123',
          description: 'Contraseña actual del usuario'
        }, 
        newPassword: { 
          type: 'string', 
          example: 'newPassword123',
          description: 'Nueva contraseña que el usuario quiere establecer'
        } 
      } 
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Contraseña cambiada exitosamente.',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Las contraseñas no son válidas o están vacías.',
  })
  async changePassword(
    @Req() req: any, // El usuario autenticado estará en req.user
    @Body() body: { currentPassword: string; newPassword: string }, // Recibe las contraseñas
  ) {
    if (!body.currentPassword || !body.newPassword) {
      throw new BadRequestException('Ambas contraseñas, actual y nueva, son necesarias');
    }

    await this.usersService.changePassword(req.user.username, body.currentPassword, body.newPassword);
    return { message: 'Contraseña cambiada exitosamente' };
  }

//===============================================================================================

  @Patch(':username/:role')
  @UseGuards(AdminGuard) // Asegura que el usuario tenga el rol correcto
  @ApiBearerAuth() // Indica que este endpoint requiere un token Bearer
  @ApiResponse({
    status: 200,
    description: 'Rol cambiado exitosamente.',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Rol inválido.',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado.',
  })
  async changeRole(
    @Req() req: any, // Usuario autenticado
    @Param('username') username: string, // Usuario objetivo
    @Param('role') role: string, // Nuevo rol
  ) {
    console.log('Request user:', req.user); // Log para verificar el contenido de req.user

    try {
      await this.usersService.changeRole(req.user.username, username, role);
      
      // Respuesta con el mensaje en formato JSON
      return { message: `Rol de usuario ${username} cambiado a ${role} exitosamente` };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException('Rol inválido');
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Usuario no encontrado');
      }
      throw error;
    }
  }
}
