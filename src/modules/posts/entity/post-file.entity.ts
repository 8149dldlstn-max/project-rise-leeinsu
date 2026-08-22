import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Post } from './post.entity';
import { PostFileType } from './post-file-type.enum';

// 게시물에 딸린 파일(이미지 여러 장·음악 1개·영상 1개) — postId FK로 정규화
@Entity('post_files')
export class PostFile {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'post_id' })
  postId: number;

  @ApiProperty({ enum: PostFileType })
  @Column({ type: 'enum', enum: PostFileType })
  type: PostFileType;

  @ApiProperty()
  @Column()
  url: string;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // 게시물 삭제 시 딸린 파일도 함께 삭제(CASCADE)
  @ManyToOne(() => Post, (post) => post.files, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;
}
