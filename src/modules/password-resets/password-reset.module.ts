import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordResetRequest } from './entity/password-reset-request.entity';
import { PasswordResetRequestRepository } from './password-reset-request.repository';
import { PasswordResetService } from './password-reset.service';
import { PasswordResetController } from './password-reset.controller';
import { AdminPasswordResetController } from './admin-password-reset.controller';
import { IPasswordResetRequestRepository } from './interface/password-reset-request.repository.interface';
import { IPasswordResetService } from './interface/password-reset.service.interface';
import { UserModule } from '../users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([PasswordResetRequest]), UserModule],
  controllers: [PasswordResetController, AdminPasswordResetController],
  providers: [
    { provide: IPasswordResetService, useClass: PasswordResetService },
    {
      provide: IPasswordResetRequestRepository,
      useClass: PasswordResetRequestRepository,
    },
  ],
})
export class PasswordResetModule {}
