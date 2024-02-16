import { SchoolNewsEntity } from '@classting/school-news/persistence/entities';
import { CreateSchoolNewsCommand } from '@classting/school-news/usecase/dtos/commands';
import { SchoolPageService } from '@classting/school-pages/usecase/services';
import { checkOrThrow } from '@libs/utils';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SchoolNewsService {
  public constructor(
    @InjectRepository(SchoolNewsEntity) private readonly schoolNewsRepository: Repository<SchoolNewsEntity>,
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
}
