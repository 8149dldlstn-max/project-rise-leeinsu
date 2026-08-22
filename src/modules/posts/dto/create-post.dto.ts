import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { BoardType } from '../entity/board-type.enum';
import {
  POST_CONTENT_MAX_LENGTH,
  POST_IMAGE_MAX_COUNT,
  POST_TITLE_MAX_LENGTH,
} from '../../../common/constants';

export class CreatePostDto {
  @ApiProperty({ enum: BoardType })
  @IsEnum(BoardType)
  boardType: BoardType;

  @ApiProperty({ required: false, description: '고정 태그 id' })
  @IsOptional()
  @IsInt()
  tagId?: number;

  @ApiProperty({ maxLength: POST_TITLE_MAX_LENGTH })
  @IsString()
  @MaxLength(POST_TITLE_MAX_LENGTH)
  title: string;

  @ApiProperty({ maxLength: POST_CONTENT_MAX_LENGTH })
  @IsString()
  @MaxLength(POST_CONTENT_MAX_LENGTH)
  content: string;

  @ApiProperty({
    required: false,
    type: [String],
    description: `이미지 URL, 최대 ${POST_IMAGE_MAX_COUNT}장`,
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(POST_IMAGE_MAX_COUNT)
  @IsUrl({}, { each: true })
  imageUrls?: string[];

  @ApiProperty({ required: false, description: '음악 파일 URL, 1개' })
  @IsOptional()
  @IsUrl()
  musicUrl?: string;

  @ApiProperty({ required: false, description: '영상 파일 URL, 1개' })
  @IsOptional()
  @IsUrl()
  videoUrl?: string;

  // 클라이언트 입력이 아니라 컨트롤러가 @CurrentUser로 주입.
  // 검증 데코레이터·@ApiProperty 없음 — whitelist가 클라이언트가 보낸 값은 제거.
  authorId: number;
}
