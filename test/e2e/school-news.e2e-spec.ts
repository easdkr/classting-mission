import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
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

describe('SchoolNewsController (e2e)', () => {
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

  describe('GET /v1/school-news', () => {
    let schoolPage;
    let subscription: SchoolPageSubscriptionEntity;
    beforeAll(async () => {
      // 학교 페이지 생성
      schoolPage = await testDataSource.manager.save(SchoolPageEntity, {
        name: 'test',
        city: City.SEOUL,
      });

      // 구독 전 뉴스 생성
      await testDataSource.manager.save(SchoolNewsEntity, {
        title: 'before subscribe',
        content: 'test',
        pageId: schoolPage.id,
      });

      // 구독 생성
      subscription = await testDataSource.manager.save(SchoolPageSubscriptionEntity, {
        userId: 1,
        pageId: schoolPage.id,
      });

      // 구독 후, 취소 전 뉴스 생성
      await testDataSource.manager.save(SchoolNewsEntity, {
        title: 'before cancel',
        content: 'test',
        pageId: schoolPage.id,
      });

      // 구독 취소
      await testDataSource.manager.update(
        SchoolPageSubscriptionEntity,
        { id: subscription.id },
        { cancelledAt: new Date() },
      );

      // 구독 취소 후 뉴스 생성
      await testDataSource.manager.save(SchoolNewsEntity, {
        title: 'after cancel',
        content: 'test',
        pageId: schoolPage.id,
      });
    });

    describe('학교 페이지를 구독하는 시점 이후 소식부터 뉴스피드를 받음', () => {
      it('구독 이전에 생성된 뉴스 미수신', async () => {
        // when
        const res = await request(app.getHttpServer())
          .get('/v1/school-news')
          .query({
            limit: 10,
          })
          .set('Cookie', cookie)
          .send();

        // then
        expect(res.statusCode).toEqual(HttpStatus.OK);
        expect(res.body.items.find((item) => item.title === 'before subscribe')).toBeUndefined();
      });

      it('구독 이후 생성된 뉴스 수신', async () => {
        // when
        const res = await request(app.getHttpServer())
          .get('/v1/school-news')
          .query({
            limit: 10,
          })
          .set('Cookie', cookie)
          .send();

        // then
        expect(res.statusCode).toEqual(HttpStatus.OK);
        expect(res.body.items.find((item) => item.title === 'before cancel')).toBeDefined();
      });
    });

    describe('학교 페이지 구독을 취소해도 기존 뉴스피드에 나타난 소식은 유지해야 함', () => {
      it('구독 취소 이전 생성된 뉴스 수신', async () => {
        // when
        const res = await request(app.getHttpServer())
          .get('/v1/school-news')
          .query({
            limit: 10,
          })
          .set('Cookie', cookie)
          .send();

        // then
        expect(res.statusCode).toEqual(HttpStatus.OK);
        expect(res.body.items.find((item) => item.title === 'before cancel')).toBeDefined();
      });

      it('구독 취소 이후 생성된 뉴스 미수신', async () => {
        // when
        const res = await request(app.getHttpServer())
          .get('/v1/school-news')
          .query({
            limit: 10,
          })
          .set('Cookie', cookie)
          .send();

        // then
        expect(res.statusCode).toEqual(HttpStatus.OK);
        expect(res.body.items.find((item) => item.title === 'after cancel')).toBeUndefined();
      });
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
