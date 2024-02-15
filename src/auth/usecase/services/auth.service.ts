import { AuthProvider } from '@classting/auth/usecase/enums';
import { checkOrThrow } from '@libs/utils';
import { HashService } from '@libs/hash';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ValidateUserResult } from '@classting/auth/usecase/dtos/results';
import { UserService } from '@classting/users/usecase/services';

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
