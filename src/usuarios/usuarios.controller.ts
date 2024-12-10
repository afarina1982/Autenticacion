import { Controller, Post, Body, Patch, Req } from '@nestjs/common';
import { UsersService } from 'src/usuarios/usuarios.service';  // Asegúrate de que la ruta sea correcta
import { AuthService } from 'src/auth.service';  // Asegúrate de que la ruta sea correcta
import { Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiBody } from '@nestjs/swagger';
import { User } from 'src/usuarios/entities/usuario.entity';  // Asegúrate de que la ruta sea correcta
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/usuarios/dto/create-usuario.dto';
import { BadRequestException } from '@nestjs/common';
import { AuthGuard } from 'src/auth.guard';  // Asegúrate de que la ruta sea correcta
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('USERS')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,  // Asegúrate de que este servicio esté correctamente inyectado
  ) { }

  @Post()
  @ApiBody({ type: CreateUserDto })
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.identifier, loginDto.password);
  }

  @Patch('password')
  @UseGuards(AuthGuard) // Asegura que el usuario esté autenticado
  @ApiBearerAuth() // Indica que este endpoint requiere un token Bearer
  @ApiBody({ schema: { 
      properties: { 
        currentPassword: { type: 'string', example: 'oldPassword123' }, 
        newPassword: { type: 'string', example: 'newPassword123' } 
      } 
    }
  })
  async changePassword(
    @Req() req: any, // El usuario autenticado estará en req.user
    @Body() body: { currentPassword: string; newPassword: string }, // Recibe las contraseñas
  ) {
    if (!body.currentPassword || !body.newPassword) {
      throw new BadRequestException('Both current and new passwords are required');
    }

    await this.usersService.changePassword(req.user.username, body.currentPassword, body.newPassword);
    return { message: 'Password changed successfully' };
  }

  @Patch(':username/:role')
  async changeRole(
    @Req() req: any,
    @Param('username') username: string,
    @Param('role') role: string,
  ) {
    return this.usersService.changeRole(req.user.username, username, role);
  }
}
