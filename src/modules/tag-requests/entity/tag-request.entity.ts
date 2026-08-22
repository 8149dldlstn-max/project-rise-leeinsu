import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { TagRequestStatus } from './tag-request-status.enum';

@Entity('tag_requests')
export class TagRequest {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ name: 'requester_id' })
  requesterId: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty({ enum: TagRequestStatus })
  @Column({
    type: 'enum',
    enum: TagRequestStatus,
    default: TagRequestStatus.PENDING,
  })
  status: TagRequestStatus;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
