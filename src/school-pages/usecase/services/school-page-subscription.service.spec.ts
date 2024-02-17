import { SchoolPageSubscriptionEntity } from '@classting/school-pages/persistence/entities';
import { SchoolPageSubscriptionQueryRepository } from '@classting/school-pages/persistence/repositories';
import { SchoolPageSubscriptionService } from '@classting/school-pages/usecase/services/school-page-subscription.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockDeep } from 'jest-mock-extended';
import { Repository } from 'typeorm';

describe('SchoolPageSubscriptionService', () => {
  let service: SchoolPageSubscriptionService;
  const mockSchoolPageSubscriptionRepository = mockDeep<Repository<SchoolPageSubscriptionEntity>>();
  const mockSchoolPageSubscriptionQueryRepository = mockDeep<SchoolPageSubscriptionQueryRepository>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchoolPageSubscriptionService,
        {
          provide: getRepositoryToken(SchoolPageSubscriptionEntity),
          useValue: mockSchoolPageSubscriptionRepository,
        },
        {
          provide: SchoolPageSubscriptionQueryRepository,
          useValue: mockSchoolPageSubscriptionQueryRepository,
        },
      ],
    }).compile();

    service = module.get<SchoolPageSubscriptionService>(SchoolPageSubscriptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('subscribe', () => {
    it('should subscribe', async () => {
      // given
      const userId = 1;
      const pageId = 1;
      mockSchoolPageSubscriptionQueryRepository.existsByFields.mockResolvedValueOnce(false);
      mockSchoolPageSubscriptionRepository.save.mockResolvedValueOnce(
        SchoolPageSubscriptionEntity.from({ userId, pageId }),
      );

      // when
      const received = await service.subscribe(userId, pageId);

      // then
      expect(received).toMatchObject({ userId, pageId });
    });

    it('should throw ConflictException when already subscribed', async () => {
      const userId = 1;
      const pageId = 1;
      mockSchoolPageSubscriptionQueryRepository.existsByFields.mockResolvedValue(true);

      await expect(service.subscribe(userId, pageId)).rejects.toThrow('Already subscribed');
    });
  });
});
