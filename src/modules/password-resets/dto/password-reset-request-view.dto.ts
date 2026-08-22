import { ApiProperty } from '@nestjs/swagger';
import { PasswordResetStatus } from '../entity/password-reset-status.enum';

export class PasswordResetRequestView {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty({ description: '요청한 사용자의 이메일' })
  email: string;

  @ApiProperty({ description: '요청한 사용자의 닉네임' })
  nickname: string;

  @ApiProperty({ enum: PasswordResetStatus })
  status: PasswordResetStatus;

  @ApiProperty({ required: false, description: '발급된 코드(발급 전에는 없음)' })
  code: string | null;

  @ApiProperty()
  createdAt: Date;
}
