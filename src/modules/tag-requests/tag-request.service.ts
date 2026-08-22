import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ITagRequestService } from './interface/tag-request.service.interface';
import { ITagRequestRepository } from './interface/tag-request.repository.interface';
import { TagRequest } from './entity/tag-request.entity';
import { TagRequestStatus } from './entity/tag-request-status.enum';
import { CreateTagRequestDto } from './dto/create-tag-request.dto';
import { ITagService } from '../tags/interface/tag.service.interface';
import { ERROR_MESSAGE } from '../../common/constants';

@Injectable()
export class TagRequestService extends ITagRequestService {
  constructor(
    private readonly tagRequestRepository: ITagRequestRepository,
    private readonly tagService: ITagService,
  ) {
    super();
  }

  create(createTagRequestDto: CreateTagRequestDto): Promise<TagRequest> {
    return this.tagRequestRepository.create({
      requesterId: createTagRequestDto.requesterId,
      name: createTagRequestDto.name,
      status: TagRequestStatus.PENDING,
    });
  }

  findAll(): Promise<TagRequest[]> {
    return this.tagRequestRepository.findAll();
  }

  private async getPendingTagRequest(id: number): Promise<TagRequest> {
    const tagRequest = await this.tagRequestRepository.findById(id);
    if (!tagRequest) {
      throw new NotFoundException(ERROR_MESSAGE.TAG_REQUEST_NOT_FOUND);
    }
    if (tagRequest.status !== TagRequestStatus.PENDING) {
      throw new BadRequestException(ERROR_MESSAGE.ALREADY_PROCESSED);
    }
    return tagRequest;
  }

  async approve(id: number): Promise<TagRequest> {
    const tagRequest = await this.getPendingTagRequest(id);
    await this.tagService.create(tagRequest.name);
    tagRequest.status = TagRequestStatus.APPROVED;
    return this.tagRequestRepository.save(tagRequest);
  }

  async reject(id: number): Promise<TagRequest> {
    const tagRequest = await this.getPendingTagRequest(id);
    tagRequest.status = TagRequestStatus.REJECTED;
    return this.tagRequestRepository.save(tagRequest);
  }
}
