import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomInt } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { IPasswordResetService } from './interface/password-reset.service.interface';
import { IPasswordResetRequestRepository } from './interface/password-reset-request.repository.interface';
import { PasswordResetRequest } from './entity/password-reset-request.entity';
import { PasswordResetStatus } from './entity/password-reset-status.enum';
import { PasswordResetRequestView } from './dto/password-reset-request-view.dto';
import { ConfirmPasswordResetDto } from './dto/confirm-password-reset.dto';
import { IUserService } from '../users/interface/user.service.interface';
import {
  ERROR_MESSAGE,
  PASSWORD_HASH_ROUNDS,
  PASSWORD_RESET_CODE_LENGTH,
} from '../../common/constants';

function generateResetCode(): string {
  const min = 10 ** (PASSWORD_RESET_CODE_LENGTH - 1);
  const max = 10 ** PASSWORD_RESET_CODE_LENGTH - 1;
  return String(randomInt(min, max + 1));
}

@Injectable()
export class PasswordResetService extends IPasswordResetService {
  constructor(
    private readonly passwordResetRequestRepository: IPasswordResetRequestRepository,
    private readonly userService: IUserService,
  ) {
    super();
  }

  async requestReset(email: string): Promise<PasswordResetRequest> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGE.USER_NOT_FOUND);
    }

    return this.passwordResetRequestRepository.create({
      userId: user.id,
      status: PasswordResetStatus.PENDING,
    });
  }

  findAll(): Promise<PasswordResetRequestView[]> {
    return this.passwordResetRequestRepository.findAllWithRequester();
  }

  async issueCode(id: number): Promise<PasswordResetRequest> {
    const request = await this.passwordResetRequestRepository.findById(id);
    if (!request) {
      throw new NotFoundException(
        ERROR_MESSAGE.PASSWORD_RESET_REQUEST_NOT_FOUND,
      );
    }
    if (request.status !== PasswordResetStatus.PENDING) {
      throw new BadRequestException(ERROR_MESSAGE.ALREADY_PROCESSED);
    }

    request.code = generateResetCode();
    request.status = PasswordResetStatus.ISSUED;
    return this.passwordResetRequestRepository.save(request);
  }

  async confirmReset(
    confirmPasswordResetDto: ConfirmPasswordResetDto,
  ): Promise<void> {
    const user = await this.userService.findByEmail(
      confirmPasswordResetDto.email,
    );
    if (!user) {
      throw new BadRequestException(ERROR_MESSAGE.PASSWORD_RESET_CODE_INVALID);
    }

    const request = await this.passwordResetRequestRepository.findByUserIdAndCode(
      user.id,
      confirmPasswordResetDto.code,
    );
    if (!request || request.status !== PasswordResetStatus.ISSUED) {
      throw new BadRequestException(ERROR_MESSAGE.PASSWORD_RESET_CODE_INVALID);
    }

    const hashedPassword = await bcrypt.hash(
      confirmPasswordResetDto.newPassword,
      PASSWORD_HASH_ROUNDS,
    );
    await this.userService.updatePassword(user.id, hashedPassword);

    request.status = PasswordResetStatus.USED;
    await this.passwordResetRequestRepository.save(request);
  }
}
