import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ITagService } from './interface/tag.service.interface';
import { Tag } from './entity/tag.entity';

@ApiTags('tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: ITagService) {}

  @Get()
  @ApiOperation({
    summary: '고정 태그 목록 조회',
    description: '승인되어 사용 가능한 고정 태그 목록을 반환한다.',
  })
  @ApiResponse({ status: 200, description: '태그 목록', type: [Tag] })
  findAll(): Promise<Tag[]> {
    return this.tagService.findAll();
  }
}
