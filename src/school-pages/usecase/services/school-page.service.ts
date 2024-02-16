import { SchoolPageEntity } from '@classting/school-pages/persistence/entities';
import { CreateSchoolPageCommand } from '@classting/school-pages/usecase/dtos/commands';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SchoolPageService {
  public constructor(
    @InjectRepository(SchoolPageEntity) private readonly schoolPageRepository: Repository<SchoolPageEntity>,
  ) {}

  public async create(command: CreateSchoolPageCommand): Promise<SchoolPageEntity> {
    const schoolPage = SchoolPageEntity.from(command);

    return this.schoolPageRepository.save(schoolPage);
  }
}
