import { AuthGuard, RoleGuard } from '@classting/auth/presentation/guards';
import { Role } from '@classting/auth/usecase/enums';
import { SchoolNewsService } from '@classting/school-news/usecase/services';
import {
  FindManySchoolPageResponse,
  FindManySchoolNewsByIdResponse,
} from '@classting/school-pages/presentation/dtos/responses';
import { SchoolPageService } from '@classting/school-pages/usecase/services';
import { UseRole } from '@libs/decorators/role.decorator';
import { OptionalParseIntPipe } from '@libs/pipes';
import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('School Pages')
@UseRole(Role.MEMBER)
@UseGuards(AuthGuard, RoleGuard)
@Controller({ path: 'school-pages', version: '1' })
export class SchoolPageController {
  public constructor(
    private readonly schoolPageService: SchoolPageService,
    private readonly schoolNewsService: SchoolNewsService,
  ) {}

  @Get()
  @ApiQuery({ name: 'limit', type: Number, required: true })
  @ApiQuery({ name: 'cursor', type: Number, required: false })
  public async findMany(
    @Query('limit', ParseIntPipe) limit: number,
    @Query('cursor', OptionalParseIntPipe) cursor?: number,
  ): Promise<FindManySchoolPageResponse> {
    const [schoolPages, nextCursor] = await this.schoolPageService.findMany(limit, cursor);

    return FindManySchoolPageResponse.from(schoolPages, nextCursor);
  }

  @Get(':id/school-news')
  @ApiQuery({ name: 'limit', type: Number, required: true })
  @ApiQuery({ name: 'cursor', type: Number, required: false })
  public async findManySchoolNewsById(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('cursor', OptionalParseIntPipe) cursor?: number,
  ) {
    const [schoolNews, nextCursor] = await this.schoolNewsService.findManyByPage({
      limit,
      cursor,
      pageId: id,
    });

    return FindManySchoolNewsByIdResponse.from(schoolNews, nextCursor);
  }
}
