import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BoardType } from './board-type.enum';
import { PostFile } from './post-file.entity';

@Entity('posts')
export class Post {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ name: 'author_id' })
  authorId: number;

  @ApiProperty({ enum: BoardType })
  @Column({ type: 'enum', enum: BoardType, name: 'board_type' })
  boardType: BoardType;

  @ApiProperty({ type: Number, required: false, nullable: true })
  @Column({ type: 'int', name: 'tag_id', nullable: true })
  tagId: number | null;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  content: string;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // 이미지·음악·영상 URL은 post_files 테이블에 정규화(1:N) — 응답 형태는 PostResponseDto가 조립
  @OneToMany(() => PostFile, (postFile) => postFile.post, { cascade: true })
  files: PostFile[];
}
