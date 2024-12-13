import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { ProyectosService } from './proyectos.service';
import { CreateProjectDto } from './dto/create-proyecto.dto';
import { AuthGuard } from 'src/auth.guard'; // Guard para autenticación
import { AdminGuard } from 'src/admin.guard'; // Guard para verificar rol de admin
import { Roles } from 'src/roles.decorator'; // Decorador para roles
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Patch, Param } from '@nestjs/common';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { RolesGuard } from 'src/roles.guard'; // Guard para verificar roles


@ApiTags('Projects')
@Controller('projects')
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) {}

  @Post()
  @ApiBearerAuth() // Añadir este decorador para requerir el token en el header
  @UseGuards(AuthGuard, AdminGuard) // Usar AuthGuard para validar JWT y AdminGuard para verificar rol admin
  @Roles('admin') // Sólo accesible para usuarios con rol admin
  async create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    const username = createProjectDto.username || req.user.username; // Si no se pasa username, asignar el del usuario autenticado
    return await this.proyectosService.create(createProjectDto, username);
  }
//================================================================================
  @Get()
  @ApiBearerAuth() // Requiere el token en el encabezado
  @UseGuards(AuthGuard) // Usar AuthGuard para validar la autenticación del usuario
  async findAll(@Request() req) {
    const username = req.user.username; // Obtener el username del usuario autenticado
    return await this.proyectosService.findByUser(username); // Llamar al servicio para obtener los proyectos
  }
//================================================================================

@Patch(':id')
  @ApiBearerAuth() // Añadir este decorador para requerir el token en el header
  @UseGuards(AuthGuard, RolesGuard) // Usar AuthGuard para validar JWT y RolesGuard para verificar el rol
  @Roles('admin') // Sólo accesible para usuarios con rol admin
  async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProyectoDto, @Request() req) {
    const project = await this.proyectosService.findOne(id);

    if (!project) {
      throw new Error('Project not found');
    }

    // Verificamos si el usuario es el propietario o un administrador
    if (project.user.username !== req.user.username && req.user.role !== 'admin') {
      throw new ForbiddenException('You do not have permission to update this project');
    }

    // Actualizamos el proyecto
    Object.assign(project, updateProjectDto);
    return await this.proyectosService.update(id, updateProjectDto);
  }


}
