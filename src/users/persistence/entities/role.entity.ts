import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;
}
