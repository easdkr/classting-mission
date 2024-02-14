import { CreateUserBody } from '@classting/users/controllers/dtos/requests';
import { UserService } from '@classting/users/services';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller({ path: 'users', version: '1' })
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @Post()
  public async create(@Body() body: CreateUserBody): Promise<string> {
    const command = body.toCommand();

    await this.userService.create(command);

    return;
  }
}
