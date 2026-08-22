import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { IFileStorageRepository } from './interface/file-storage.repository.interface';
import { SupabaseClientService } from '../../common/utils/supabase/supabase-client.service';
import { ERROR_MESSAGE, SUPABASE_STORAGE_BUCKET } from '../../common/constants';

// IFileStorageRepository 구현(Supabase Storage) — 저장·공개 URL 조회만 담당
@Injectable()
export class FileStorageRepository extends IFileStorageRepository {
  private readonly logger = new Logger(FileStorageRepository.name);

  constructor(private readonly supabaseClientService: SupabaseClientService) {
    super();
  }

  async upload(
    objectPath: string,
    buffer: Buffer,
    contentType: string,
  ): Promise<string> {
    const client = this.supabaseClientService.getClient();
    const { error } = await client.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .upload(objectPath, buffer, { contentType, upsert: false });

    if (error) {
      // 클라이언트에는 일반 메시지만, 실제 원인은 서버 로그로 남긴다
      this.logger.error(
        `Supabase Storage 업로드 실패 (bucket=${SUPABASE_STORAGE_BUCKET}, path=${objectPath}): ${error.message}`,
        error,
      );
      throw new InternalServerErrorException(ERROR_MESSAGE.FILE_UPLOAD_FAILED);
    }

    const { data } = client.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .getPublicUrl(objectPath);

    return data.publicUrl;
  }
}
