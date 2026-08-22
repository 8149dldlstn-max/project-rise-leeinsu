import { ApiProperty } from '@nestjs/swagger';

export class UserProfileView {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nickname: string;

  @ApiProperty({ required: false, nullable: true })
  statusMessage: string | null;

  @ApiProperty({ type: String, required: false, nullable: true })
  profileImageUrl: string | null;
}
