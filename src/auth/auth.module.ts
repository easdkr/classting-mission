import { AuthController } from '@classting/auth/presentation/controllers/auth.controller';
import { AuthService } from '@classting/auth/usecase/services';
import { SessionSerializer, LocalStrategy } from '@classting/auth/usecase/strategies';
import { UserModule } from '@classting/users/user.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [UserModule],
  providers: [AuthService, SessionSerializer, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
