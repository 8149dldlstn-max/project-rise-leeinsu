import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entity/tag.entity';
import { TagRepository } from './tag.repository';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { ITagRepository } from './interface/tag.repository.interface';
import { ITagService } from './interface/tag.service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  controllers: [TagController],
  providers: [
    { provide: ITagService, useClass: TagService },
    { provide: ITagRepository, useClass: TagRepository },
  ],
  exports: [ITagService],
})
export class TagModule {}
