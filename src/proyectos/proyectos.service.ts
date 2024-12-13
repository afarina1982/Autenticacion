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

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id: Number(id) } }); // Convertimos id a number
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
  // Buscar el proyecto por ID, incluyendo el usuario asignado
  const project = await this.projectRepository.findOne({
    where: { id: Number(id) },
    relations: ['user'], // Relación con el usuario para verificar permisos
  });

  if (!project) {
    throw new NotFoundException('Project not found');
  }

  // Validar permisos: solo admin o el propietario pueden editar
  if (role !== 'admin' && project.user.username !== username) {
    throw new UnauthorizedException(
      'You do not have permission to update this project',
    );
  }

  // Si se proporciona un nuevo username, buscar al nuevo usuario
  if (updateProjectDto.username && updateProjectDto.username !== project.user.username) {
    const newUser = await this.userRepository.findOne({
      where: { username: updateProjectDto.username },
    });

    if (!newUser) {
      throw new NotFoundException('New user not found');
    }

    project.user = newUser; // Actualizar la relación del usuario
  }

  // Actualizar los campos del proyecto, si son proporcionados
  if (updateProjectDto.name) project.name = updateProjectDto.name;
  if (updateProjectDto.description) project.description = updateProjectDto.description;

  // Guardar los cambios
  return await this.projectRepository.save(project);
}
}
