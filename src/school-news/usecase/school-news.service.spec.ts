import { SchoolNewsEntity } from '@classting/school-news/persistence/entities';
import { SchoolNewsService } from '@classting/school-news/usecase/school-news.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockDeep } from 'jest-mock-extended';
import { Repository } from 'typeorm';

describe('SchoolNewsService', () => {
  let service: SchoolNewsService;
  const schoolNewsrepository = mockDeep<Repository<SchoolNewsEntity>>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchoolNewsService,
        {
          provide: getRepositoryToken(SchoolNewsEntity),
          useValue: schoolNewsrepository,
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
      schoolNewsrepository.save.mockResolvedValueOnce(schoolNews);

      // when
      const result = await service.create(command);

      // then
      expect(result).toEqual(schoolNews);
    });
  });
});
