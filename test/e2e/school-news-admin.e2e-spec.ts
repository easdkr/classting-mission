import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { createDatabase, createTestDataSource } from '@test/utils/test-datasource';
import { IBackup, IMemoryDb } from 'pg-mem';
import { RoleEntity } from '@classting/users/persistence/entities';
import { roleFixture, schoolPageFixture, userFixture } from '@test/fixtures';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@classting/app.module';
import { initializeApplication } from '@libs/configs';
import { UserService } from '@classting/users/usecase/services';
import { SchoolPageEntity } from '@classting/school-pages/persistence/entities';
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

describe('SchoolNewsAdminController (e2e)', () => {
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
      email: userFixture[0].email,
      password: userFixture[0].password,
    };

    // when
    const res = await request(app.getHttpServer()).post('/v1/auth/signin').send(body);

    // then
    expect(res.statusCode).toEqual(HttpStatus.CREATED);
    cookie = res.header['set-cookie'];
  });

  describe('(POST) v1/school-news', () => {
    const endpoint = '/v1/school-news';

    it('should create a school page', async () => {
      // given
      const body = {
        title: 'Test news',
        content: 'Test news content',
        pageId: 1,
      };

      // when
      const res = await request(app.getHttpServer()).post(endpoint).set('Cookie', cookie).send(body);

      // then
      expect(res.statusCode).toEqual(HttpStatus.CREATED);
      expect(res.body).toMatchObject({
        id: expect.any(Number),
        title: 'Test news',
        content: 'Test news content',
        pageId: 1,
      });

      const schoolNews = await testDataSource.manager.findOne(SchoolNewsEntity, {
        where: { id: res.body.id },
      });

      expect(schoolNews).toMatchObject({
        id: expect.any(Number),
        title: 'Test news',
        content: 'Test news content',
        pageId: 1,
      });
    });

    it('should return 404 when pageId is invalid', async () => {
      // given
      const body = {
        title: 'Test news',
        content: 'Test news content',
        pageId: 999,
      };

      // when
      const res = await request(app.getHttpServer()).post(endpoint).set('Cookie', cookie).send(body);

      // then
      expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
    });
  });

  describe('(PUT) v1/school-news/:id', () => {
    const endpoint = '/v1/school-news';
    let createRes;

    beforeAll(async () => {
      const body = {
        title: 'Test news',
        content: 'Test news content',
        pageId: 1,
      };

      createRes = await request(app.getHttpServer()).post(endpoint).set('Cookie', cookie).send(body);
    });

    it('should update a school news', async () => {
      // given
      const updateBody = {
        title: 'Updated news',
        content: 'Updated news content',
        pageId: 1,
      };

      // when
      const res = await request(app.getHttpServer())
        .put(`${endpoint}/${createRes.body.id}`)
        .set('Cookie', cookie)
        .send(updateBody);

      // then
      expect(res.statusCode).toEqual(HttpStatus.OK);
      expect(res.body).toMatchObject({
        id: createRes.body.id,
        title: 'Updated news',
        content: 'Updated news content',
        pageId: 1,
      });

      const schoolNews = await testDataSource.manager.findOne(SchoolNewsEntity, {
        where: { id: createRes.body.id },
      });

      expect(schoolNews).toMatchObject({
        id: createRes.body.id,
        title: 'Updated news',
        content: 'Updated news content',
        pageId: 1,
      });
    });

    it('should return 404 when pageId is invalid', async () => {
      // given
      const updateBody = {
        title: 'Updated news',
        content: 'Updated news content',
        pageId: 999,
      };

      // when
      const res = await request(app.getHttpServer())
        .put(`${endpoint}/${createRes.body.id}`)
        .set('Cookie', cookie)
        .send(updateBody);

      // then
      expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
    });

    it('should return 404 when news id is invalid', async () => {
      // given
      const updateBody = {
        title: 'Updated news',
        content: 'Updated news content',
        pageId: 1,
      };

      // when
      const res = await request(app.getHttpServer()).put(`${endpoint}/999`).set('Cookie', cookie).send(updateBody);

      // then
      expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
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
    email: userFixture[0].email,
    password: userFixture[0].password,
    roleId: userFixture[0].roleId,
  });

  await ds.manager.save(SchoolPageEntity, schoolPageFixture);
}
