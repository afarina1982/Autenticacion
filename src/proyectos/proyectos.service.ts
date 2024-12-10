import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from 'src/proyectos/entities/proyecto.entity';
import { User } from 'src/usuarios/entities/usuario.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)  // Inyecta el repositorio de User
    private readonly userRepository: Repository<User>,
  ) {}

  async createProject(name: string, description: string, username: string): Promise<Project> {
    // Buscar al usuario por su nombre de usuario
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }
    // Crear y guardar el proyecto
    const project = this.projectRepository.create({ name, description, user });
    return this.projectRepository.save(project);
  }
}
