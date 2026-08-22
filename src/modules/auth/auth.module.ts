import { Module } from '@nestjs/common';
import { UserModule } from '../users/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { IAuthService } from './interface/auth.service.interface';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [{ provide: IAuthService, useClass: AuthService }],
})
export class AuthModule {}
