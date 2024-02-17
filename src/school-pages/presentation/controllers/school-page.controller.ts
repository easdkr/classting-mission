import { AuthGuard, RoleGuard } from '@classting/auth/presentation/guards';
import { Role } from '@classting/auth/usecase/enums';
import { SchoolNewsService } from '@classting/school-news/usecase/services';
import {
  FindManySchoolPageResponse,
  FindManySchoolNewsByIdResponse,
  SubscribeSchoolPageResponse,
} from '@classting/school-pages/presentation/dtos/responses';
import { SubscriptionGuard } from '@classting/school-pages/presentation/guards';
import { FindSchoolPageOnlySubscribedCommand } from '@classting/school-pages/usecase/dtos/commands';
import { SchoolPageService, SchoolPageSubscriptionService } from '@classting/school-pages/usecase/services';
import { SessionUser, User } from '@libs/decorators';
import { UseRole } from '@libs/decorators/role.decorator';
import { OptionalParseIntPipe } from '@libs/pipes';
import { Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('School Pages')
@UseRole(Role.MEMBER)
@UseGuards(AuthGuard, RoleGuard)
@Controller({ path: 'school-pages', version: '1' })
export class SchoolPageController {
  public constructor(
    private readonly schoolPageService: SchoolPageService,
    private readonly schoolNewsService: SchoolNewsService,
    private readonly schoolPageSubscriptionService: SchoolPageSubscriptionService,
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

  @Get('/subscriptions')
  public async findOnlySubscribed(
    @Query('limit', ParseIntPipe) limit: number,
    @User() user: SessionUser,
    @Query('cursor', OptionalParseIntPipe) cursor?: number,
  ): Promise<FindManySchoolPageResponse> {
    const commands: FindSchoolPageOnlySubscribedCommand = {
      limit,
      cursor,
      userId: user.id,
    };

    const [schoolPages, nextCursor] = await this.schoolPageService.findOnlySubscribed(commands);

    return FindManySchoolPageResponse.from(schoolPages, nextCursor);
  }

  @Get(':id/school-news')
  @UseGuards(SubscriptionGuard)
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

  @Post(':id/subscribe')
  public async subscribe(
    @Param('id', ParseIntPipe) id: number,
    @User() user: SessionUser,
  ): Promise<SubscribeSchoolPageResponse> {
    const subscriptionEntity = await this.schoolPageSubscriptionService.subscribe(user.id, id);

    return SubscribeSchoolPageResponse.fromEntity(subscriptionEntity);
  }

  @Delete(':id/subscribe')
  public async unsubscribe(@Param('id', ParseIntPipe) id: number, @User() user: SessionUser): Promise<boolean> {
    return await this.schoolPageSubscriptionService.unsubscribe(user.id, id);
  }
}
