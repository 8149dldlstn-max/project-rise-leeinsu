import { ApiProperty } from '@nestjs/swagger';
import { BoardType } from '../entity/board-type.enum';

// 응답 전용 형태 — post_files 테이블 내용을 클라이언트가 쓰던 기존 필드 모양으로 조립해 내려준다
export class PostResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  authorId: number;

  @ApiProperty({ enum: BoardType })
  boardType: BoardType;

  @ApiProperty({ type: Number, required: false, nullable: true })
  tagId: number | null;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ type: [String] })
  imageUrls: string[];

  @ApiProperty({ type: String, required: false, nullable: true })
  musicUrl: string | null;

  @ApiProperty({ type: String, required: false, nullable: true })
  videoUrl: string | null;

  @ApiProperty()
  createdAt: Date;
}
