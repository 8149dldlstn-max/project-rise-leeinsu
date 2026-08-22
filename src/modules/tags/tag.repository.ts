import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITagRepository } from './interface/tag.repository.interface';
import { Tag } from './entity/tag.entity';

@Injectable()
export class TagRepository extends ITagRepository {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {
    super();
  }

  create(tag: Partial<Tag>): Promise<Tag> {
    return this.tagRepository.save(this.tagRepository.create(tag));
  }

  findAll(): Promise<Tag[]> {
    return this.tagRepository.find();
  }

  findById(id: number): Promise<Tag | null> {
    return this.tagRepository.findOne({ where: { id } });
  }
}
