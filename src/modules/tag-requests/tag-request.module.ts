import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagRequest } from './entity/tag-request.entity';
import { TagRequestRepository } from './tag-request.repository';
import { TagRequestService } from './tag-request.service';
import { TagRequestController } from './tag-request.controller';
import { AdminTagRequestController } from './admin-tag-request.controller';
import { ITagRequestRepository } from './interface/tag-request.repository.interface';
import { ITagRequestService } from './interface/tag-request.service.interface';
import { TagModule } from '../tags/tag.module';

@Module({
  imports: [TypeOrmModule.forFeature([TagRequest]), TagModule],
  controllers: [TagRequestController, AdminTagRequestController],
  providers: [
    { provide: ITagRequestService, useClass: TagRequestService },
    { provide: ITagRequestRepository, useClass: TagRequestRepository },
  ],
})
export class TagRequestModule {}
