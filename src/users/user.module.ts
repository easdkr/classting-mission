import { RoleEntity, UserEntity } from '@classting/users/persistence/entities';
import { RoleQueryRepository, UserQueryRepository } from '@classting/users/persistence/repositories';
import { UserController } from '@classting/users/presentation/controllers';
import { UserService } from '@classting/users/usecase/services';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity])],
  providers: [UserService, RoleQueryRepository, UserQueryRepository],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
