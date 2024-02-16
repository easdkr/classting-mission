import { SchoolPageEntity } from '@classting/school-pages/persistence/entities';
import { SchoolPageQueryRepository } from '@classting/school-pages/persistence/repositories';
import { CreateSchoolPageCommand } from '@classting/school-pages/usecase/dtos/commands';
import { Maybe } from '@libs/functional';
import { CursorResult } from '@libs/types';
import { checkOrThrow } from '@libs/utils';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SchoolPageService {
  public constructor(
    @InjectRepository(SchoolPageEntity) private readonly schoolPageRepository: Repository<SchoolPageEntity>,
    private readonly schoolPageQueryRepository: SchoolPageQueryRepository,
  ) {}

  public async create(command: CreateSchoolPageCommand): Promise<SchoolPageEntity> {
    const exists = await this.schoolPageQueryRepository.existsByFields({ city: command.city, name: command.name });
    checkOrThrow(!exists, new ConflictException('School page already exists'));

    const schoolPage = SchoolPageEntity.from(command);

    return this.schoolPageRepository.save(schoolPage);
  }

  public async delete(id: number): Promise<boolean> {
    const deleteRes = await this.schoolPageRepository.delete({ id });

    return deleteRes.affected === 1;
  }

  public async findOne(id: number): Promise<Maybe<SchoolPageEntity>> {
    const schoolPage = await this.schoolPageQueryRepository.findUnique({ id });

    return schoolPage;
  }

  public async findMany(limit: number, cursor?: number): Promise<CursorResult<SchoolPageEntity>> {
    const [schoolPages, nextCursor] = await this.schoolPageQueryRepository.findMany({ limit, cursor });

    return [schoolPages, nextCursor];
  }

  public async exists(id: number): Promise<boolean> {
    return this.schoolPageQueryRepository.existsByFields({ id });
  }
}
