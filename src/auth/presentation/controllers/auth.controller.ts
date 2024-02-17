import { SignInBody } from '@classting/auth/presentation/dtos/requests';
import { LocalAuthGuard } from '@classting/auth/presentation/guards';
import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  public constructor() {}

  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: SignInBody })
  @ApiForbiddenResponse()
  @Post('signin')
  public async signIn(): Promise<string> {
    return 'OK';
  }
}
