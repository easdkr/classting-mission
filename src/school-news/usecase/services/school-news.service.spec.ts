import { SchoolNewsEntity } from '@classting/school-news/persistence/entities';
import { SchoolNewsService } from '@classting/school-news/usecase/services/school-news.service';
import { SchoolPageService } from '@classting/school-pages/usecase/services';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockDeep } from 'jest-mock-extended';
import { Repository } from 'typeorm';

describe('SchoolNewsService', () => {
  let service: SchoolNewsService;
  const mockSchoolNewsRepository = mockDeep<Repository<SchoolNewsEntity>>();
  const mockSchoolPageService = mockDeep<SchoolPageService>();

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
});
