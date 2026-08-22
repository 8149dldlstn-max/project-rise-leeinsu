import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class UpdateProfileImageDto {
  @ApiProperty({
    description: '/files/upload로 업로드해서 받은 공개 URL',
    example:
      'https://xdgoxzxgnmoqxbougqxx.supabase.co/storage/v1/object/public/TEam7/xxxx.png',
  })
  @IsUrl()
  profileImageUrl: string;
}
