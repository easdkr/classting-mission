import { SignInBody } from '@classting/auth/controllers/dtos/requests';
import { LocalAuthGuard } from '@classting/auth/controllers/guards';
import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor() {}

  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: SignInBody })
  @Post('signin')
  public async signIn(): Promise<string> {
    return 'OK';
  }
}
