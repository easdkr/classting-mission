import { SchoolNewsEntity } from '@classting/school-news/persistence/entities';
import { CreateSchoolNewsCommand } from '@classting/school-news/usecase/dtos/commands';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SchoolNewsService {
  public constructor(
    @InjectRepository(SchoolNewsEntity) private readonly schoolNewsRepository: Repository<SchoolNewsEntity>,
  ) {}

  public async create(commands: CreateSchoolNewsCommand): Promise<SchoolNewsEntity> {
    const schoolNews = SchoolNewsEntity.from({
      title: commands.title,
      content: commands.content,
      pageId: commands.pageId,
    });

    return this.schoolNewsRepository.save(schoolNews);
  }
}
