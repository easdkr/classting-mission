import { SchoolPageEntity } from '@classting/school-pages/persistence/entities';
import { SchoolPageQueryRepository } from '@classting/school-pages/persistence/repositories';
import { City } from '@classting/school-pages/usecase/enums';
import { SchoolPageService } from '@classting/school-pages/usecase/services/school-page.service';
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockDeep } from 'jest-mock-extended';
import { Repository } from 'typeorm';

describe('SchoolPageService', () => {
  let service: SchoolPageService;
  const schoolPageRepository = mockDeep<Repository<SchoolPageEntity>>();
  const mockSchoolPageQueryRepository = mockDeep<SchoolPageQueryRepository>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchoolPageService,
        {
          provide: getRepositoryToken(SchoolPageEntity),
          useValue: schoolPageRepository,
        },
        {
          provide: SchoolPageQueryRepository,
          useValue: mockSchoolPageQueryRepository,
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
        city: City.SEOUL,
        name: 'school',
      };

      const schoolPage = SchoolPageEntity.from(command);
      schoolPageRepository.save.mockResolvedValueOnce(schoolPage);

      // when
      const result = await service.create(command);

      // then
      expect(result).toEqual(schoolPage);
    });

    it('should not create a school page if already exists (city, name)', async () => {
      // given
      const command = {
        city: City.SEOUL,
        name: 'school',
      };
      mockSchoolPageQueryRepository.existsByFields.mockResolvedValueOnce(true);

      // when
      const receive = service.create(command);

      // then
      expect(receive).rejects.toThrowError('School page already exists');
    });
  });

  describe('delete', () => {
    it('should delete a school page', async () => {
      // given
      const id = 1;
      schoolPageRepository.delete.mockResolvedValueOnce({ affected: 1, raw: [] });

      // when
      const result = await service.delete(id);

      // then
      expect(result).toBe(true);
    });

    it('should not delete a school page', async () => {
      // given
      const id = 1;
      schoolPageRepository.delete.mockResolvedValueOnce({ affected: 0, raw: [] });

      // when
      const result = await service.delete(id);

      // then
      expect(result).toBe(false);
    });
  });
});
