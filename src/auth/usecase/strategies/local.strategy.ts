import { AuthService } from '@classting/auth/usecase/services/auth.service';
import { ValidateUserResult } from '@classting/auth/usecase/dtos/results';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email', passReqToCallback: true });
  }

  public async validate(_: Request, email: string, password: string): Promise<ValidateUserResult> {
    const userData = await this.authService.validateUser(email, password);

    return userData;
  }
}
