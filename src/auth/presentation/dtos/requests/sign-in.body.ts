import { IsEmail, IsString } from 'class-validator';

export class SignInBody {
  /**
   * @example test@email.com
   */
  @IsEmail()
  email: string;

  /**
   * @example Abc123!@#
   */
  @IsString()
  password: string;
}
