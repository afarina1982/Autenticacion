import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { ProyectosService } from './proyectos.service';
import { CreateProjectDto } from './dto/create-proyecto.dto';
import { AuthGuard } from 'src/auth.guard'; // Guard para autenticación
import { AdminGuard } from 'src/admin.guard'; // Guard para verificar rol de admin
import { Roles } from 'src/roles.decorator'; // Decorador para roles
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Patch, Param } from '@nestjs/common';
import { RolesGuard } from 'src/roles.guard'; // Guard para verificar roles
import { UpdateProjectDto } from './dto/update-proyecto.dto';
import { ApiBody } from '@nestjs/swagger';



@ApiTags('Projects')
@Controller('projects')
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) { }

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
  @ApiBearerAuth() // Requerir el token en el header
  @UseGuards(AuthGuard, AdminGuard) // Usar AuthGuard para validar JWT y AdminGuard para verificar rol admin
  @Roles('admin') // Permitir acceso a admins
  @ApiBody({
    description: 'Datos para actualizar el proyecto',
    examples: {
      updateProject: {
        summary: 'Actualizar un proyecto existente',
        value: {
          name: 'Nuevo Nombre del Proyecto',
          description: 'Actualización de la descripción del proyecto',
          username: 'nuevo_usuario', // Cambiar propietario
        },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req,
  ) {
    const username = req.user.username; // Obtener el username del usuario autenticado
    const role = req.user.role; // Obtener el rol del usuario autenticado
  
    return await this.proyectosService.update(id, updateProjectDto, username, role);
  }

}
