import { AuthProvider } from '@classting/auth/enums';
import { ValidateUserResult } from '@classting/auth/services/dtos/results';
import { checkOrThrow } from '@classting/common/utils';
import { HashService } from '@classting/hash';
import { UserService } from '@classting/users/services';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';

@Injectable()
export class AuthService {
  public constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
  ) {}

  public async validateUser(email: string, password: string): Promise<ValidateUserResult> {
    const user = await this.userService
      .findOne({ email: email })
      .then((v) => v.getOrThrow(new UnprocessableEntityException('User not found')));

    const isEmailProvider = user.provider === AuthProvider.EMAIL;
    checkOrThrow(isEmailProvider, new UnprocessableEntityException('invalid provider'));

    const isPasswordValid = await this.hashService.compare(password, user.password);
    checkOrThrow(isPasswordValid, new UnprocessableEntityException('invalid password'));

    return {
      id: user.id,
      email: user.email,
    };
  }
}
