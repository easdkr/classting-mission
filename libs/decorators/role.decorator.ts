import { Role } from '@classting/auth/usecase/enums';
import { SetMetadata } from '@nestjs/common';

export const UseRoleMetadataKey = Symbol('__roles__');

export const UseRole = (...roles: Role[]) => SetMetadata(UseRoleMetadataKey, roles);
