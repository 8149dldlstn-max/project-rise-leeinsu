import { TagRequest } from '../entity/tag-request.entity';

export abstract class ITagRequestRepository {
  abstract create(tagRequest: Partial<TagRequest>): Promise<TagRequest>;
  abstract findAll(): Promise<TagRequest[]>;
  abstract findById(id: number): Promise<TagRequest | null>;
  abstract save(tagRequest: TagRequest): Promise<TagRequest>;
}
