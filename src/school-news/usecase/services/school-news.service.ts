import { SchoolNewsEntity } from '@classting/school-news/persistence/entities';
import { SchoolNewsQueryRepository } from '@classting/school-news/persistence/repositories';
import {
  CreateSchoolNewsCommand,
  FindAllSubscribedPageNewsCommand,
  FindManySchoolNewsByPageCommand,
  UpdateSchoolNewsCommand,
} from '@classting/school-news/usecase/dtos/commands';
import { SchoolPageService } from '@classting/school-pages/usecase/services';
import { CursorResult } from '@libs/types';
import { checkOrThrow } from '@libs/utils';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SchoolNewsService {
  public constructor(
    @InjectRepository(SchoolNewsEntity) private readonly schoolNewsRepository: Repository<SchoolNewsEntity>,
    private readonly schoolNewsQueryRepository: SchoolNewsQueryRepository,
    private readonly schoolPageService: SchoolPageService,
  ) {}

  public async create(commands: CreateSchoolNewsCommand): Promise<SchoolNewsEntity> {
    const pageExists = await this.schoolPageService.exists(commands.pageId);
    checkOrThrow(pageExists, new NotFoundException('Page not found'));

    const schoolNews = SchoolNewsEntity.from({
      title: commands.title,
      content: commands.content,
      pageId: commands.pageId,
    });

    return this.schoolNewsRepository.save(schoolNews);
  }

  public async update(id: number, commands: UpdateSchoolNewsCommand): Promise<SchoolNewsEntity> {
    const pageExists = await this.schoolPageService.exists(commands.pageId);
    checkOrThrow(pageExists, new NotFoundException('Page not found'));

    const schoolNews = await this.schoolNewsQueryRepository
      .findUnique({ id })
      .then((res) => res.getOrThrow(new NotFoundException('School news not found')));

    schoolNews.title = commands.title;
    schoolNews.content = commands.content;
    schoolNews.pageId = commands.pageId;

    return this.schoolNewsRepository.save(schoolNews);
  }

  public async delete(id: number): Promise<boolean> {
    const deleteRes = await this.schoolNewsRepository.delete({ id });

    return deleteRes.affected === 1;
  }

  public async findManyByPage(commands: FindManySchoolNewsByPageCommand): Promise<CursorResult<SchoolNewsEntity>> {
    const [schoolNews, nextCursor] = await this.schoolNewsQueryRepository.findMany({
      limit: commands.limit,
      cursor: commands.cursor,
      field: { pageId: commands.pageId },
    });

    return [schoolNews, nextCursor];
  }

  public async findAllSubscribedPageNews({
    limit,
    userId,
    cursor,
  }: FindAllSubscribedPageNewsCommand): Promise<CursorResult<SchoolNewsEntity>> {
    const [schoolNews, nextCursor] = await this.schoolNewsQueryRepository.findSubscribedPageNews({
      limit,
      cursor,
      userId,
      includeCancelled: true,
    });

    return [schoolNews, nextCursor];
  }
}
