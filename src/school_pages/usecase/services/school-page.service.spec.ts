import { SchoolPageEntity } from '@classting/school_pages/persistence/entities';
import { City } from '@classting/school_pages/usecase/enums';
import { SchoolPageService } from '@classting/school_pages/usecase/services/school-page.service';
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockDeep } from 'jest-mock-extended';
import { Repository } from 'typeorm';

describe('SchoolPageService', () => {
  let service: SchoolPageService;
  const schoolPageRepository = mockDeep<Repository<SchoolPageEntity>>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchoolPageService,
        {
          provide: getRepositoryToken(SchoolPageEntity),
          useValue: schoolPageRepository,
        },
      ],
    }).compile();

    service = module.get<SchoolPageService>(SchoolPageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a school page', async () => {
      // given
      const command = {
        city: City.Seoul,
        name: 'school',
      };

      const schoolPage = SchoolPageEntity.from(command);
      schoolPageRepository.save.mockResolvedValueOnce(schoolPage);

      // when
      const result = await service.create(command);

      // then
      expect(result).toEqual(schoolPage);
    });
  });
});
