import { CreateUserBody } from '@classting/users/presentation/dtos/requests';
import { FindAllRolesResponse } from '@classting/users/presentation/dtos/responses';
import { UserService } from '@classting/users/usecase/services';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller({ path: 'users', version: '1' })
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @Post()
  public async create(@Body() body: CreateUserBody): Promise<void> {
    const command = body.toCommand();

    await this.userService.create(command);

    return;
  }

  @Get('roles')
  public async findAllRoles(): Promise<FindAllRolesResponse> {
    const roles = await this.userService.findAllRoles();

    return FindAllRolesResponse.fromEntity(roles);
  }
}
