import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { MarkKind } from './mark-kind.enum';

@Entity('timeline_marks')
export class TimelineMark {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ name: 'post_id' })
  postId: number;

  @ApiProperty()
  @Column({ name: 'author_id' })
  authorId: number;

  @ApiProperty({ description: '몇 초 지점인지' })
  @Column({ type: 'float', name: 'timestamp_sec' })
  timestampSec: number;

  @ApiProperty({ enum: MarkKind })
  @Column({ type: 'enum', enum: MarkKind })
  kind: MarkKind;

  @ApiProperty({ type: String, required: false, nullable: true })
  @Column({ type: 'varchar', nullable: true })
  tag: string | null;

  @ApiProperty({ type: String, required: false, nullable: true })
  @Column({ type: 'varchar', nullable: true })
  emoji: string | null;

  @ApiProperty({ type: String, required: false, nullable: true })
  @Column({ type: 'text', nullable: true })
  content: string | null;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
