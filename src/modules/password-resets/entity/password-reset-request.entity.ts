import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { PasswordResetStatus } from './password-reset-status.enum';

@Entity('password_reset_requests')
export class PasswordResetRequest {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ name: 'user_id' })
  userId: number;

  @ApiProperty({ type: String, required: false, nullable: true, description: '발급된 코드(발급 전에는 없음)' })
  @Column({ type: 'varchar', nullable: true })
  code: string | null;

  @ApiProperty({ enum: PasswordResetStatus })
  @Column({
    type: 'enum',
    enum: PasswordResetStatus,
    default: PasswordResetStatus.PENDING,
  })
  status: PasswordResetStatus;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
