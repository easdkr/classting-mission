import { UserController } from '@classting/users/controllers/user.controller';
import { RoleEntity, UserEntity } from '@classting/users/persistence/entities';
import { RoleQueryRepository, UserQueryRepository } from '@classting/users/repositories';
import { UserService } from '@classting/users/services';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity])],
  providers: [UserService, RoleQueryRepository, UserQueryRepository],
  controllers: [UserController],
})
export class UserModule {}
