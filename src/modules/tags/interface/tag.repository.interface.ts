import { Tag } from '../entity/tag.entity';

export abstract class ITagRepository {
  abstract create(tag: Partial<Tag>): Promise<Tag>;
  abstract findAll(): Promise<Tag[]>;
  abstract findById(id: number): Promise<Tag | null>;
}
