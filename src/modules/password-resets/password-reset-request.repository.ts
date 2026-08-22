import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPasswordResetRequestRepository } from './interface/password-reset-request.repository.interface';
import { PasswordResetRequest } from './entity/password-reset-request.entity';
import { PasswordResetRequestView } from './dto/password-reset-request-view.dto';
import { User } from '../users/entity/user.entity';

@Injectable()
export class PasswordResetRequestRepository extends IPasswordResetRequestRepository {
  constructor(
    @InjectRepository(PasswordResetRequest)
    private readonly passwordResetRequestRepository: Repository<PasswordResetRequest>,
  ) {
    super();
  }

  create(
    request: Partial<PasswordResetRequest>,
  ): Promise<PasswordResetRequest> {
    return this.passwordResetRequestRepository.save(
      this.passwordResetRequestRepository.create(request),
    );
  }

  findAllWithRequester(): Promise<PasswordResetRequestView[]> {
    return this.passwordResetRequestRepository
      .createQueryBuilder('request')
      .leftJoin(User, 'requester', 'requester.id = request.userId')
      .select('request.id', 'id')
      .addSelect('request.userId', 'userId')
      .addSelect('requester.email', 'email')
      .addSelect('requester.nickname', 'nickname')
      .addSelect('request.status', 'status')
      .addSelect('request.code', 'code')
      .addSelect('request.createdAt', 'createdAt')
      .orderBy('request.createdAt', 'DESC')
      .getRawMany<PasswordResetRequestView>();
  }

  findById(id: number): Promise<PasswordResetRequest | null> {
    return this.passwordResetRequestRepository.findOne({ where: { id } });
  }

  findByUserIdAndCode(
    userId: number,
    code: string,
  ): Promise<PasswordResetRequest | null> {
    return this.passwordResetRequestRepository.findOne({
      where: { userId, code },
    });
  }

  save(request: PasswordResetRequest): Promise<PasswordResetRequest> {
    return this.passwordResetRequestRepository.save(request);
  }
}
