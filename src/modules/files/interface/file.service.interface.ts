import { UploadedFileResponseDto } from '../dto/uploaded-file-response.dto';

export abstract class IFileService {
  abstract uploadFile(
    file: Express.Multer.File,
  ): Promise<UploadedFileResponseDto>;
}
