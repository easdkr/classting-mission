import { AuthGuard, RoleGuard } from '@classting/auth/presentation/guards';
import { Role } from '@classting/auth/usecase/enums';
import { FindAllSubscribedPageNewsResponse } from '@classting/school-news/presentation/dtos/responses';
import { SchoolNewsService } from '@classting/school-news/usecase/services';
import { SessionUser, User } from '@libs/decorators';
import { UseRole } from '@libs/decorators/role.decorator';
import { OptionalParseIntPipe } from '@libs/pipes';
import { Controller, Get, ParseIntPipe, Query, UseGuards } from '@nestjs/common';

@Controller({ path: 'school-news', version: '1' })
@UseGuards(AuthGuard, RoleGuard)
@UseRole(Role.MEMBER)
export class SchoolNewsController {
  public constructor(private readonly schoolNewsService: SchoolNewsService) {}

  @Get()
  public async findAllSubscribedPageNews(
    @User() user: SessionUser,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('cursor', OptionalParseIntPipe) cursor?: number,
  ) {
    const [schoolNews, nextCursor] = await this.schoolNewsService.findAllSubscribedPageNews({
      userId: user.id,
      limit,
      cursor,
    });

    return FindAllSubscribedPageNewsResponse.from(schoolNews, nextCursor);
  }
}
