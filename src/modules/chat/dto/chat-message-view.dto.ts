import { ApiProperty } from '@nestjs/swagger';

export class ChatMessageView {
  @ApiProperty()
  id: number;

  @ApiProperty()
  authorId: number;

  @ApiProperty({ description: '발신자 닉네임' })
  nickname: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;
}
