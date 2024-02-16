import { AuthProvider } from '@classting/auth/usecase/enums';
import { BaseEntity } from '@libs/database/entities';
import { RoleEntity } from '@classting/users/persistence/entities';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

interface IUser {
  email: string;
  password: string;
  provider?: AuthProvider;
  roleId: number;
}

@Entity('users')
@Unique('idx_email_on_users', ['email'])
export class UserEntity extends BaseEntity {
  @Column()
  public email: string;

  @Column()
  public password: string;

  @Column({ default: AuthProvider.EMAIL })
  public provider: AuthProvider;

  @Column({ name: 'role_id' })
  public roleId: number;

  @ManyToOne(() => RoleEntity)
  @JoinColumn({ name: 'role_id' })
  public role: RoleEntity;

  public static from(params: IUser) {
    const entity = new UserEntity();
    entity.email = params.email;
    entity.provider = params.provider;
    entity.roleId = params.roleId;
    entity.password = params.password;

    return entity;
  }
}
