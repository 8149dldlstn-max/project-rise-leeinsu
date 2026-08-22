import { PasswordResetRequest } from '../entity/password-reset-request.entity';
import { PasswordResetRequestView } from '../dto/password-reset-request-view.dto';
import { ConfirmPasswordResetDto } from '../dto/confirm-password-reset.dto';

export abstract class IPasswordResetService {
  abstract requestReset(email: string): Promise<PasswordResetRequest>;
  abstract findAll(): Promise<PasswordResetRequestView[]>;
  abstract issueCode(id: number): Promise<PasswordResetRequest>;
  abstract confirmReset(
    confirmPasswordResetDto: ConfirmPasswordResetDto,
  ): Promise<void>;
}
