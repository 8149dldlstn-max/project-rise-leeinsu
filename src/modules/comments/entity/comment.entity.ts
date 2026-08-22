import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('comments')
export class Comment {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ name: 'post_id' })
  postId: number;

  @ApiProperty()
  @Column({ name: 'author_id' })
  authorId: number;

  @ApiProperty({ type: Number, required: false, nullable: true, description: '대댓글인 경우 부모 댓글 id' })
  @Column({ type: 'int', name: 'parent_id', nullable: true })
  parentId: number | null;

  @ApiProperty()
  @Column({ type: 'text' })
  content: string;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
