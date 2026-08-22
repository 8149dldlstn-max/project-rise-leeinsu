import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FileStorageRepository } from './file-storage.repository';
import { IFileService } from './interface/file.service.interface';
import { IFileStorageRepository } from './interface/file-storage.repository.interface';

@Module({
  controllers: [FileController],
  providers: [
    { provide: IFileService, useClass: FileService },
    { provide: IFileStorageRepository, useClass: FileStorageRepository },
  ],
  exports: [IFileService],
})
export class FileModule {}
