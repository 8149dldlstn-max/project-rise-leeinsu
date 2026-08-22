import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import { IFileService } from './interface/file.service.interface';
import { IFileStorageRepository } from './interface/file-storage.repository.interface';
import { UploadedFileResponseDto } from './dto/uploaded-file-response.dto';
import { ERROR_MESSAGE, FILE_ALLOWED_MIME_PREFIXES } from '../../common/constants';

// IFileService 구현 — 파일 형식 검증 후 IFileStorageRepository에 위임
@Injectable()
export class FileService extends IFileService {
  constructor(private readonly fileStorageRepository: IFileStorageRepository) {
    super();
  }

  async uploadFile(
    file: Express.Multer.File,
  ): Promise<UploadedFileResponseDto> {
    if (!file) {
      throw new BadRequestException(ERROR_MESSAGE.FILE_REQUIRED);
    }
    if (!this.isAllowedMimeType(file.mimetype)) {
      throw new BadRequestException(ERROR_MESSAGE.FILE_TYPE_INVALID);
    }

    const objectPath = `${randomUUID()}${extname(file.originalname)}`;
    const url = await this.fileStorageRepository.upload(
      objectPath,
      file.buffer,
      file.mimetype,
    );

    return { url };
  }

  private isAllowedMimeType(mimetype: string): boolean {
    return FILE_ALLOWED_MIME_PREFIXES.some((prefix) =>
      mimetype.startsWith(prefix),
    );
  }
}
