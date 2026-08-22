import { Injectable, NotFoundException } from '@nestjs/common';
import { ITagService } from './interface/tag.service.interface';
import { ITagRepository } from './interface/tag.repository.interface';
import { Tag } from './entity/tag.entity';
import { ERROR_MESSAGE } from '../../common/constants';

@Injectable()
export class TagService extends ITagService {
  constructor(private readonly tagRepository: ITagRepository) {
    super();
  }

  create(name: string): Promise<Tag> {
    return this.tagRepository.create({ name });
  }

  findAll(): Promise<Tag[]> {
    return this.tagRepository.findAll();
  }

  async getExistingTag(id: number): Promise<Tag> {
    const tag = await this.tagRepository.findById(id);
    if (!tag) {
      throw new NotFoundException(ERROR_MESSAGE.TAG_NOT_FOUND);
    }
    return tag;
  }
}
