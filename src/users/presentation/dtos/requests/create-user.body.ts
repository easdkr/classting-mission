import { CreateUserCommand } from '@classting/users/usecase/dtos/commands';
import { Exclude } from 'class-transformer';
import { IsEmail, IsInt, Length, Matches } from 'class-validator';

export class CreateUserBody {
  /**
   * @example test@email.com
   */
  @IsEmail()
  public email: string;

  /**
   * @example Abc123!@#
   */
  @Matches(
    /(?=.*[A-Za-z])(?=.*\d)(?=.*[`~!@#$%^&*()\-_=+{}\[\]\\|;:'",.<>/?])[A-Za-z\d`~!@#$%^&*()\-_=+{}\[\]\\|;:'",.<>/?]+/,
    {
      message: 'Password does not match minimal password requirements.',
    },
  )
  @Length(6, 128)
  public password: string;

  /**
   * @example 1
   */
  @IsInt()
  public roleId: number;

  @Exclude()
  public toCommand(): CreateUserCommand {
    return {
      email: this.email,
      password: this.password,
      roleId: this.roleId,
    };
  }
}
