import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITagRequestRepository } from './interface/tag-request.repository.interface';
import { TagRequest } from './entity/tag-request.entity';

@Injectable()
export class TagRequestRepository extends ITagRequestRepository {
  constructor(
    @InjectRepository(TagRequest)
    private readonly tagRequestRepository: Repository<TagRequest>,
  ) {
    super();
  }

  create(tagRequest: Partial<TagRequest>): Promise<TagRequest> {
    return this.tagRequestRepository.save(
      this.tagRequestRepository.create(tagRequest),
    );
  }

  findAll(): Promise<TagRequest[]> {
    return this.tagRequestRepository.find({ order: { createdAt: 'DESC' } });
  }

  findById(id: number): Promise<TagRequest | null> {
    return this.tagRequestRepository.findOne({ where: { id } });
  }

  save(tagRequest: TagRequest): Promise<TagRequest> {
    return this.tagRequestRepository.save(tagRequest);
  }
}
