import { Controller, Post, Body, Req, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from 'src/proyectos/proyectos.service';
import { CreateProjectDto } from 'src/proyectos/dto/create-proyecto.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles.decorator';
import { BadRequestException } from '@nestjs/common';
import { RolesGuard } from 'src/roles.guard';


@ApiTags('PROJECTS')
@Controller('projects')
@UseGuards(RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiBearerAuth()
  @Roles('admin')
  async createProject(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    // Verificar y usar el username desde el body o el token
    const username = createProjectDto.username || req.user?.username;
    if (!username) {
      throw new BadRequestException('Username is required');
    }

    return this.projectsService.createProject(createProjectDto.name, createProjectDto.description, username);
  }
}


