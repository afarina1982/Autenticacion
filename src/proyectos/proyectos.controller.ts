import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ProjectsService } from 'src/proyectos/proyectos.service';
import { CreateProjectDto } from 'src/proyectos/dto/create-proyecto.dto';
import { AuthGuard } from 'src/auth.guard';
import { ApiTags } from '@nestjs/swagger';



@ApiTags('PROJECTS')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(AuthGuard) // Protegido por autenticación
  async createProject(@Req() req: any, @Body() body: CreateProjectDto) {
    const username = body.username || req.user.username;
    return this.projectsService.createProject(body.name, body.description, username);
  }
}


