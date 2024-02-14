import { AuthController } from '@classting/auth/controllers/auth.controller';
import { AuthService } from '@classting/auth/services';
import { LocalStrategy, SessionSerializer } from '@classting/auth/services/strategies';
import { UserModule } from '@classting/users/user.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [UserModule],
  providers: [AuthService, SessionSerializer, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
