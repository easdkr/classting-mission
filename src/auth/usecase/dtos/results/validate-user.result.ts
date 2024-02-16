import { Role } from '@classting/auth/usecase/enums';

export interface ValidateUserResult {
  id: number;
  email: string;
  role: Role;
}
