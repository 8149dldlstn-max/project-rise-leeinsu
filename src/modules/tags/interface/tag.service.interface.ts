import { Tag } from '../entity/tag.entity';

export abstract class ITagService {
  abstract create(name: string): Promise<Tag>;
  abstract findAll(): Promise<Tag[]>;
  abstract getExistingTag(id: number): Promise<Tag>;
}
