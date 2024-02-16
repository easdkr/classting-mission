import { SchoolNewsEntity } from '@classting/school-news/persistence/entities';
import { SchoolNewsQueryRepository } from '@classting/school-news/persistence/repositories';
import { SchoolNewsService } from '@classting/school-news/usecase/services/school-news.service';
import { SchoolPageService } from '@classting/school-pages/usecase/services';
import { Maybe } from '@libs/functional';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockDeep } from 'jest-mock-extended';
import { Repository } from 'typeorm';

describe('SchoolNewsService', () => {
  let service: SchoolNewsService;
  const mockSchoolNewsRepository = mockDeep<Repository<SchoolNewsEntity>>();
  const mockSchoolPageService = mockDeep<SchoolPageService>();
  const mockSchoolNewsQueryRepository = mockDeep<SchoolNewsQueryRepository>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchoolNewsService,
        {
          provide: getRepositoryToken(SchoolNewsEntity),
          useValue: mockSchoolNewsRepository,
        },
        {
          provide: SchoolPageService,
          useValue: mockSchoolPageService,
        },
        {
          provide: SchoolNewsQueryRepository,
          useValue: mockSchoolNewsQueryRepository,
        },
      ],
    }).compile();

    service = module.get<SchoolNewsService>(SchoolNewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a school news', async () => {
      // given
      const command = {
        title: 'title',
        content: 'content',
        pageId: 1,
      };

      const schoolNews = SchoolNewsEntity.from(command);
      mockSchoolNewsRepository.save.mockResolvedValueOnce(schoolNews);
      mockSchoolPageService.exists.mockResolvedValueOnce(true);
      // when
      const result = await service.create(command);

      // then
      expect(result).toEqual(schoolNews);
    });

    it('should throw not found exception when page not found', async () => {
      // given
      const command = {
        title: 'title',
        content: 'content',
        pageId: 1,
      };

      mockSchoolPageService.exists.mockResolvedValueOnce(false);

      // when
      const received = service.create(command);

      // then
      await expect(received).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update a school news', async () => {
      // given
      const id = 1;
      const command = {
        title: 'title',
        content: 'content',
        pageId: 1,
      };

      const schoolNews = SchoolNewsEntity.from(command);
      mockSchoolNewsQueryRepository.findUnique.mockResolvedValueOnce(Maybe.of(schoolNews));
      mockSchoolNewsRepository.save.mockResolvedValueOnce(schoolNews);
      mockSchoolPageService.exists.mockResolvedValueOnce(true);

      // when
      const result = await service.update(id, command);

      // then
      expect(result).toEqual(schoolNews);
    });

    it('should throw not found exception when school news not found', async () => {
      // given
      const id = 1;
      const command = {
        title: 'title',
        content: 'content',
        pageId: 1,
      };

      mockSchoolNewsQueryRepository.findUnique.mockResolvedValueOnce(Maybe.nothing());

      // when
      const received = service.update(id, command);

      // then
      await expect(received).rejects.toThrow();
    });

    it('should throw not found exception when page not found', async () => {
      // given
      const id = 1;
      const command = {
        title: 'title',
        content: 'content',
        pageId: 1,
      };

      const schoolNews = SchoolNewsEntity.from(command);
      mockSchoolNewsQueryRepository.findUnique.mockResolvedValueOnce(Maybe.of(schoolNews));
      mockSchoolPageService.exists.mockResolvedValueOnce(false);

      // when
      const received = service.update(id, command);

      // then
      await expect(received).rejects.toThrow();
    });
  });
});
