import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { IFileService } from './interface/file.service.interface';
import { UploadedFileResponseDto } from './dto/uploaded-file-response.dto';
import { FILE_SIZE_MAX_BYTES } from '../../common/constants';

@ApiTags('files')
@Controller('files')
export class FileController {
  constructor(private readonly fileService: IFileService) {}

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: FILE_SIZE_MAX_BYTES } }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOperation({
    summary: '파일 업로드',
    description:
      '이미지·영상·음성 파일을 Supabase Storage(TEam7 버킷)에 업로드하고 공개 URL을 반환한다. 최대 50MB.',
  })
  @ApiResponse({
    status: 201,
    description: '업로드된 파일의 공개 URL',
    type: UploadedFileResponseDto,
  })
  @ApiResponse({ status: 400, description: '파일이 없거나 허용되지 않는 형식' })
  @ApiResponse({ status: 401, description: '로그인이 필요함' })
  @ApiResponse({ status: 413, description: '파일 용량 초과(50MB)' })
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadedFileResponseDto> {
    return this.fileService.uploadFile(file);
  }
}
