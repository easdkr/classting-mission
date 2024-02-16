import { SchoolPageSubscriptionEntity } from '@classting/school-pages/persistence/entities';
import { SchoolPageSubscriptionQueryRepository } from '@classting/school-pages/persistence/repositories';
import { SchoolPageSubscriptionService } from '@classting/school-pages/usecase/services/school-page-subscription.service';
import { SchoolPageService } from '@classting/school-pages/usecase/services/school-page.service';
import { Maybe } from '@libs/functional';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockDeep } from 'jest-mock-extended';
import { Repository } from 'typeorm';

describe('SchoolPageSubscriptionService', () => {
  let service: SchoolPageSubscriptionService;
  const mockSchoolPageSubscriptionRepository = mockDeep<Repository<SchoolPageSubscriptionEntity>>();
  const mockSchoolPageSubscriptionQueryRepository = mockDeep<SchoolPageSubscriptionQueryRepository>();
  const mockSchoolPageService = mockDeep<SchoolPageService>();
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
        {
          provide: SchoolPageService,
          useValue: mockSchoolPageService,
        },
      ],
    }).compile();

    service = module.get<SchoolPageSubscriptionService>(SchoolPageSubscriptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('subscribe', () => {
    it('첫 시도 시 정상적으로 구독이 성공해야 한다.', async () => {
      // given
      const userId = 1;
      const pageId = 1;
      const mockSubscription = SchoolPageSubscriptionEntity.from({ userId, pageId });

      mockSchoolPageService.exists.mockResolvedValueOnce(true);
      mockSchoolPageSubscriptionQueryRepository.findUnique.mockResolvedValueOnce(Maybe.nothing());
      mockSchoolPageSubscriptionRepository.save.mockResolvedValueOnce(mockSubscription);

      // when
      const received = await service.subscribe(userId, pageId);

      // then
      expect(received).toMatchObject({ userId, pageId });
    });

    it('이미 구독 중이라면 에러를 던져야 한다.', async () => {
      // given
      const userId = 1;
      const pageId = 1;
      const mockSubscription = SchoolPageSubscriptionEntity.from({ userId, pageId });
      mockSchoolPageService.exists.mockResolvedValueOnce(true);
      mockSchoolPageSubscriptionQueryRepository.findUnique.mockResolvedValueOnce(Maybe.of(mockSubscription));

      // when
      const received = service.subscribe(userId, pageId);

      // then
      await expect(received).rejects.toThrow('Already subscribed');
    });

    it('해당 페이지가 존재하지 않는다면 에러를 던져야 한다.', async () => {
      // given
      const userId = 1;
      const pageId = 1;
      mockSchoolPageService.exists.mockResolvedValueOnce(false);

      // when
      const received = service.subscribe(userId, pageId);

      // then
      await expect(received).rejects.toThrow('School page not found');
    });

    it('구독이 취소된 경우 다시 구독이 가능해야 한다.', async () => {
      // given
      const userId = 1;
      const pageId = 1;
      const mockSubscription = SchoolPageSubscriptionEntity.from({ userId, pageId });
      mockSubscription.cancel(); // 구독 취소

      mockSchoolPageService.exists.mockResolvedValueOnce(true);
      mockSchoolPageSubscriptionQueryRepository.findUnique.mockResolvedValueOnce(Maybe.of(mockSubscription));
      mockSchoolPageSubscriptionRepository.save.mockResolvedValueOnce(mockSubscription);

      // when
      const received = await service.subscribe(userId, pageId);

      // then
      expect(received).toMatchObject({ userId, pageId, cancelledAt: null });
    });
  });

  describe('unsubscribe', () => {
    it('should unsubscribe', async () => {
      // given
      const userId = 1;
      const pageId = 1;
      mockSchoolPageSubscriptionQueryRepository.findUnique.mockResolvedValueOnce(
        Maybe.of(SchoolPageSubscriptionEntity.from({ userId, pageId })),
      );
      mockSchoolPageSubscriptionRepository.save.mockResolvedValueOnce(
        SchoolPageSubscriptionEntity.from({ userId, pageId }),
      );

      // when
      const received = await service.unsubscribe(userId, pageId);

      // then
      expect(received).toBe(true);
    });

    it('should throw UnprocessableEntityException when not subscribed', async () => {
      const userId = 1;
      const pageId = 1;
      mockSchoolPageSubscriptionQueryRepository.findUnique.mockResolvedValueOnce(Maybe.nothing());

      await expect(service.unsubscribe(userId, pageId)).rejects.toThrow('Not subscribed');
    });
  });
});
