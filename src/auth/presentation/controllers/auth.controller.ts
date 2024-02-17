import { SignInBody } from '@classting/auth/presentation/dtos/requests';
import { LocalAuthGuard } from '@classting/auth/presentation/guards';
import { Controller, InternalServerErrorException, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  public constructor() {}

  /**
   * 로그인
   */
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: SignInBody })
  @ApiForbiddenResponse()
  @Post('signin')
  public async signIn(): Promise<string> {
    return 'OK';
  }

  /**
   * 로그아웃
   */
  @Post('signout')
  public async signOut(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      if (req.sessionID) {
        req.session.destroy((err) => {
          if (err) throw new InternalServerErrorException(`Couldn't destroy session`);
        });
      }
    } catch (err) {
      console.error(err);
    }
    res.cookie('_sid_', '', { maxAge: 0 });
    res.status(204).send();
  }
}
