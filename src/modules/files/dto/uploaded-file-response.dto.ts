import { ApiProperty } from '@nestjs/swagger';

// 업로드 성공 응답 — 공개 URL 하나만 내려준다
export class UploadedFileResponseDto {
  @ApiProperty({
    example:
      'https://xdgoxzxgnmoqxbougqxx.supabase.co/storage/v1/object/public/TEam7/xxxx.png',
  })
  url: string;
}
