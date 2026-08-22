import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../common/types/user-role.enum';

@Entity('users')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  nickname: string;

  @ApiProperty({ required: false })
  @Column({ name: 'status_message', nullable: true })
  statusMessage: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @Column({ type: 'varchar', name: 'profile_image_url', nullable: true })
  profileImageUrl: string | null;

  @ApiProperty({ enum: UserRole })
  // DB에서 수동으로 지정 — 셀프서비스 어드민 승격 기능은 만들지 않음
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
