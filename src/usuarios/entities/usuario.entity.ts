import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Project } from 'src/proyectos/entities/proyecto.entity';
@Entity('users')
export class User {
  @PrimaryColumn()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({ type: 'enum', enum: ['admin', 'user'], default: 'user' })
  role: string;

  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];
}
