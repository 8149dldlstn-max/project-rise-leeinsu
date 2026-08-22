import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatMessageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  // 클라이언트 입력이 아니라 컨트롤러가 @CurrentUser로 주입.
  // 검증 데코레이터·@ApiProperty 없음 — whitelist가 클라이언트가 보낸 값은 제거.
  authorId: number;
}
