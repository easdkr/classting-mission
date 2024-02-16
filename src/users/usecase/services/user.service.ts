import { Maybe } from '@libs/functional';
import { EntityCondition } from '@libs/types';
import { checkOrThrow } from '@libs/utils';
import { HashService } from '@libs/hash';
import { UserEntity } from '@classting/users/persistence/entities';
import { RoleQueryRepository, UserQueryRepository } from '@classting/users/persistence/repositories';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserCommand } from '@classting/users/usecase/dtos/commands';

@Injectable()
export class UserService {
  public constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private readonly hashService: HashService,
    private readonly userQueryRepository: UserQueryRepository,
    private readonly roleQueryRepository: RoleQueryRepository,
  ) {}

  public async create(command: CreateUserCommand): Promise<void> {
    const roleExists = await this.roleQueryRepository.existsById(command.roleId);
    checkOrThrow(roleExists, new BadRequestException('Role does not exist'));

    const emailExists = await this.userQueryRepository.existsByEmail(command.email);
    checkOrThrow(!emailExists, new BadRequestException('Email already exists'));

    const hashedPassword = await this.hashService.hash(command.password);

    const user = UserEntity.from({
      email: command.email,
      password: hashedPassword,
      roleId: command.roleId,
    });

    await this.userRepository.save(user, { reload: false });
  }

  public async findOne(field: EntityCondition<UserEntity>): Promise<Maybe<UserEntity>> {
    const user = await this.userQueryRepository.findUnique(field);

    return user;
  }
}
