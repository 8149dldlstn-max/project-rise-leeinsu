import { PasswordResetRequest } from '../entity/password-reset-request.entity';
import { PasswordResetRequestView } from '../dto/password-reset-request-view.dto';

export abstract class IPasswordResetRequestRepository {
  abstract create(
    request: Partial<PasswordResetRequest>,
  ): Promise<PasswordResetRequest>;
  abstract findAllWithRequester(): Promise<PasswordResetRequestView[]>;
  abstract findById(id: number): Promise<PasswordResetRequest | null>;
  abstract findByUserIdAndCode(
    userId: number,
    code: string,
  ): Promise<PasswordResetRequest | null>;
  abstract save(
    request: PasswordResetRequest,
  ): Promise<PasswordResetRequest>;
}
