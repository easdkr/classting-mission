import { CreateUserBody } from '@classting/users/presentation/dtos/requests';
import { FindAllRolesResponse } from '@classting/users/presentation/dtos/responses';
import { UserService } from '@classting/users/usecase/services';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBadGatewayResponse, ApiConflictResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller({ path: 'users', version: '1' })
export class UserController {
  public constructor(private readonly userService: UserService) {}

  /**
   * 회원 가입
   */
  @Post()
  @ApiBadGatewayResponse({ description: 'Role does not exist' })
  @ApiConflictResponse({ description: 'Email already exists' })
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
