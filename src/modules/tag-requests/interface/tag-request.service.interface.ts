import { TagRequest } from '../entity/tag-request.entity';
import { CreateTagRequestDto } from '../dto/create-tag-request.dto';

export abstract class ITagRequestService {
  abstract create(
    createTagRequestDto: CreateTagRequestDto,
  ): Promise<TagRequest>;
  abstract findAll(): Promise<TagRequest[]>;
  abstract approve(id: number): Promise<TagRequest>;
  abstract reject(id: number): Promise<TagRequest>;
}
