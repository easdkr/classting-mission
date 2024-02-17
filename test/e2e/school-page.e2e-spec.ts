import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource, IsNull } from 'typeorm';
import { createDatabase, createTestDataSource } from '@test/utils/test-datasource';
import { IBackup, IMemoryDb } from 'pg-mem';
import { RoleEntity } from '@classting/users/persistence/entities';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@classting/app.module';
import { initializeApplication } from '@libs/configs';
import { UserService } from '@classting/users/usecase/services';
import { memberUserFixture, roleFixture } from '@test/fixtures';
import { SchoolPageEntity, SchoolPageSubscriptionEntity } from '@classting/school-pages/persistence/entities';
import { City } from '@classting/school-pages/usecase/enums';
import { SchoolNewsEntity } from '@classting/school-news/persistence/entities';

let memDB: IMemoryDb;
let testDataSource: DataSource;
let backup: IBackup;
let moduleFixture: TestingModule;
let app: INestApplication;

beforeAll(async () => {
  await initializeTest();
});

afterAll(async () => {
  await clearTest();
});

describe('SchoolPageController (e2e)', () => {
  let cookie: string;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useValue(testDataSource)
      .compile();

    app = moduleFixture.createNestApplication();

    initializeApplication(app);
    await app.init();
    await setupFixture(testDataSource);
  });

  beforeAll(async () => {
    // given
    const body = {
      email: memberUserFixture[0].email,
      password: memberUserFixture[0].password,
    };

    // when
    const res = await request(app.getHttpServer()).post('/v1/auth/signin').send(body);

    // then
    expect(res.statusCode).toEqual(HttpStatus.CREATED);
    cookie = res.header['set-cookie'];
  });

  describe('GET /v1/school-pages', () => {
    describe('without data', () => {
      it('', async () => {
        // when
        const res = await request(app.getHttpServer())
          .get('/v1/school-pages')
          .query({
            limit: 20,
          })
          .set('cookie', cookie);

        // then
        expect(res.statusCode).toEqual(HttpStatus.OK);
        expect(res.body.nextCursor).toBeUndefined();
        expect(res.body.items).toHaveLength(0);
      });
    });

    describe('with data', () => {
      beforeAll(async () => {
        const schoolPages = Array.from({ length: 20 }, (_, i) =>
          SchoolPageEntity.from({ name: `school-name-${i}`, city: i % 2 ? City.SEOUL : City.BUSAN }),
        );
        await testDataSource.manager.save(SchoolPageEntity, schoolPages);
      });

      it('(LIST) without cursor param', async () => {
        // when
        const res = await request(app.getHttpServer())
          .get('/v1/school-pages')
          .query({
            limit: 10,
          })
          .set('cookie', cookie);

        // then
        expect(res.statusCode).toEqual(HttpStatus.OK);
        expect(res.body.nextCursor).toEqual(10);
        expect(res.body.items).toHaveLength(10);
      });

      it('(LIST) with cursor param', async () => {
        // when
        const res = await request(app.getHttpServer())
          .get('/v1/school-pages')
          .query({
            limit: 10,
            cursor: 10,
          })
          .set('cookie', cookie);

        // then
        expect(res.statusCode).toEqual(HttpStatus.OK);
        expect(res.body.nextCursor).toBeUndefined();
        expect(res.body.items).toHaveLength(10);
      });

      it('(LIST) with cursor param (last page)', async () => {
        // when
        const res = await request(app.getHttpServer())
          .get('/v1/school-pages')
          .query({
            limit: 10,
            cursor: 20,
          })
          .set('cookie', cookie);

        // then
        expect(res.statusCode).toEqual(HttpStatus.OK);
        expect(res.body.nextCursor).toBeUndefined();
        expect(res.body.items).toHaveLength(0);
      });
    });
  });

  describe('GET /v1/school-pages/subscriptions', () => {
    beforeAll(async () => {
      // 페이지 생성
      await testDataSource.manager.query(
        `INSERT INTO school_pages (id, name, city) VALUES (100, 'school-name-100', 'Seoul'), (101, 'school-name-101', 'Busan')`,
      );

      // 구독
      await testDataSource.manager.query(`INSERT INTO school_page_subscriptions (user_id, page_id) VALUES (1, 100)`);
    });

    it('구독 중인 페이지 조회', async () => {
      // when
      const res = await request(app.getHttpServer())
        .get('/v1/school-pages/subscriptions')
        .query({
          limit: 5,
        })
        .set('cookie', cookie);

      // then
      expect(res.statusCode).toEqual(HttpStatus.OK);
      expect(res.body.items).toHaveLength(1);
      expect(res.body.items[0]).toMatchObject({
        id: 100,
        name: 'school-name-100',
        city: City.SEOUL,
      });
    });
  });

  describe('GET /v1/school-pages/:id/school-news', () => {
    const schoolPageId = 5;
    describe('미구독', () => {
      it('미구독 시 Forbidden 에러가 발생해야 한다.', async () => {
        // when
        const res = await request(app.getHttpServer())
          .get(`/v1/school-pages/${schoolPageId}/school-news`)
          .query({
            limit: 20,
          })
          .set('cookie', cookie);

        // then
        expect(res.statusCode).toEqual(HttpStatus.FORBIDDEN);
      });
    });

    describe('구독시 페이지별 뉴스 조회', () => {
      beforeAll(async () => {
        // page 1: 0 ~ 9, page 2: 10 ~ 19
        const schoolNews = Array.from({ length: 20 }, (_, i) =>
          SchoolNewsEntity.from({ title: `title-${i}`, content: `content-${i}`, pageId: schoolPageId }),
        );
        await testDataSource.manager.save(SchoolNewsEntity, schoolNews);

        // 구독
        await request(app.getHttpServer()).post(`/v1/school-pages/${schoolPageId}/subscribe`).set('cookie', cookie);
      });

      it('(LIST) without cursor param', async () => {
        // when
        const res = await request(app.getHttpServer())
          .get(`/v1/school-pages/${schoolPageId}/school-news`)
          .query({
            limit: 10,
          })
          .set('cookie', cookie);

        // then
        expect(res.statusCode).toEqual(HttpStatus.OK);
        expect(res.body.nextCursor).toEqual(10);
        expect(res.body.items).toHaveLength(10);
      });
    });
  });

  describe('POST /v1/school-pages/:id/subscribe', () => {
    it('should subscribe', async () => {
      // when
      const res = await request(app.getHttpServer()).post('/v1/school-pages/1/subscribe').set('cookie', cookie);

      // then
      expect(res.statusCode).toEqual(HttpStatus.CREATED);
      expect(res.body).toMatchObject({
        userId: 1,
        pageId: 1,
      });

      const subscription = await testDataSource.manager.findOne(SchoolPageSubscriptionEntity, {
        where: { userId: 1, pageId: 1, cancelledAt: null },
      });

      expect(subscription).toBeDefined();
    });

    it('should throw ConflictException when already subscribed', async () => {
      // when
      const res = await request(app.getHttpServer()).post('/v1/school-pages/1/subscribe').set('cookie', cookie);

      // then
      expect(res.statusCode).toEqual(HttpStatus.CONFLICT);
      expect(res.body.message).toEqual('Already subscribed');
    });
  });

  describe('DELETE /v1/school-pages/:id/subscribe', () => {
    it('should unsubscribe', async () => {
      // when
      const res = await request(app.getHttpServer()).delete('/v1/school-pages/1/subscribe').set('cookie', cookie);

      // then
      expect(res.statusCode).toEqual(HttpStatus.OK);
      expect(res.text).toEqual('true');

      const subscription = await testDataSource.manager.findOne(SchoolPageSubscriptionEntity, {
        where: { userId: 1, pageId: 1, cancelledAt: IsNull() },
      });

      expect(subscription).toBeNull();
    });

    it('should return false when not subscribed', async () => {
      // when
      const res = await request(app.getHttpServer()).delete('/v1/school-pages/1/subscribe').set('cookie', cookie);

      // then
      expect(res.statusCode).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });
  });
});

async function initializeTest() {
  memDB = createDatabase();
  testDataSource = await createTestDataSource(memDB);
  await testDataSource.initialize();
  backup = memDB.backup();
}

async function clearTest() {
  backup.restore();
  await testDataSource.destroy();
  moduleFixture.close();
}

async function setupFixture(ds: DataSource) {
  await ds.manager.save(RoleEntity, roleFixture);
  const userService = app.get<UserService>(UserService);
  await userService.create({
    email: memberUserFixture[0].email,
    password: memberUserFixture[0].password,
    roleId: memberUserFixture[0].roleId,
  });
}
