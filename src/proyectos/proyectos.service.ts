import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/proyecto.entity';
import { CreateProjectDto } from './dto/create-proyecto.dto';
import { User } from 'src/usuarios/entities/usuario.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UpdateProjectDto } from './dto/update-proyecto.dto';
import { UnauthorizedException } from '@nestjs/common';



@Injectable()
export class ProyectosService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createProjectDto: CreateProjectDto, username: string): Promise<Project> {
    const user = await this.userRepository.findOne({ where: { username } });

    
    if (!user) {
      throw new Error('User not found');
    }

    
    const project = this.projectRepository.create({
      ...createProjectDto,
      user: user,  
    });

    return await this.projectRepository.save(project);
  }
  //================================================================================
  async findByUser(username: string): Promise<Project[]> {
    const projects = await this.projectRepository.find({
      where: {
        user: { username }, 
      },
    });

   
    console.log('Proyectos encontrados:', projects);

    return projects;
  }
  //================================================================================

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id: Number(id) } }); 
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }
//================================================================================
async update(
  id: string,
  updateProjectDto: UpdateProjectDto,
  username: string,
  role: string,
): Promise<Project> {
  
  const project = await this.projectRepository.findOne({
    where: { id: Number(id) },
    relations: ['user'], 
  });

  if (!project) {
    throw new NotFoundException('Project not found');
  }

  
  if (role !== 'admin' && project.user.username !== username) {
    throw new UnauthorizedException(
      'You do not have permission to update this project',
    );
  }

  
  if (updateProjectDto.username && updateProjectDto.username !== project.user.username) {
    const newUser = await this.userRepository.findOne({
      where: { username: updateProjectDto.username },
    });

    if (!newUser) {
      throw new NotFoundException('New user not found');
    }

    project.user = newUser; 
  }

  
  if (updateProjectDto.name) project.name = updateProjectDto.name;
  if (updateProjectDto.description) project.description = updateProjectDto.description;

 
  return await this.projectRepository.save(project);
}
//================================================================================

async deleteProject(id: number, user: User): Promise<void> {
  const project = await this.projectRepository.findOne({
    where: { id },
    relations: ['user'],
  });

  if (!project) {
    throw new NotFoundException('Proyecto no encontrado');
  }

  // Verificamos si el usuario es el propietario del proyecto
  if (project.user.username !== user.username) {
    throw new ForbiddenException('No tienes permiso para borrar este proyecto');
  }

  // Eliminamos el proyecto
  await this.projectRepository.remove(project);
}
}
