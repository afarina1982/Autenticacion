import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/proyecto.entity';
import { CreateProjectDto } from './dto/create-proyecto.dto';
import { User } from 'src/usuarios/entities/usuario.entity';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';

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

    // Si el usuario no existe, lanzar una excepción o manejarlo de otra manera
    if (!user) {
      throw new Error('User not found');
    }

    // Crear el proyecto y asignar la relación con el usuario
    const project = this.projectRepository.create({
      ...createProjectDto,
      user: user,  // Asignar el objeto completo del usuario
    });

    return await this.projectRepository.save(project);
  }
  //================================================================================
  async findByUser(username: string): Promise<Project[]> {
    const projects = await this.projectRepository.find({
      where: {
        user: { username }, // Suponiendo que 'user' es la relación con la entidad User
      },
    });

    // Log para ver los proyectos obtenidos
    console.log('Proyectos encontrados:', projects);

    return projects;
  }
  //================================================================================

  async findOne(id: string): Promise<Project | undefined> {
    return this.projectRepository.findOne({ where: { id: Number(id) } }); // Convertir id a number
  }

  // Actualizar un proyecto
  async update(id: string, updateProjectDto: UpdateProyectoDto): Promise<Project> {
    const project = await this.findOne(id);

    // Si el proyecto no existe, lanzar una excepción
    if (!project) {
      throw new Error('Project not found');
    }

    // Asignar los nuevos valores del DTO al proyecto
    const updatedProject = Object.assign(project, updateProjectDto);
    return this.projectRepository.save(updatedProject);
  }
}
