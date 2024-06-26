import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { createDatabase, createTestDataSource } from '@test/utils/test-datasource';
import { IBackup, IMemoryDb } from 'pg-mem';
import { RoleEntity } from '@classting/users/persistence/entities';
import { adminUserFixture, roleFixture } from '@test/fixtures';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@classting/app.module';
import { initializeApplication } from '@libs/configs';
import { UserService } from '@classting/users/usecase/services';
import { SchoolPageEntity } from '@classting/school-pages/persistence/entities';
import { City } from '@classting/school-pages/usecase/enums';

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

describe('SchoolPageAdminController (e2e)', () => {
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
      email: adminUserFixture[0].email,
      password: adminUserFixture[0].password,
    };

    // when
    const res = await request(app.getHttpServer()).post('/v1/auth/signin').send(body);

    // then
    expect(res.statusCode).toEqual(HttpStatus.CREATED);
    cookie = res.header['set-cookie'];
  });

  it('(POST) v1/school-pages', async () => {
    // given
    const body = {
      city: 'Seoul',
      name: 'Test School',
    };

    // when
    const res = await request(app.getHttpServer()).post('/v1/school-pages').set('Cookie', cookie).send(body);

    // then
    expect(res.statusCode).toEqual(HttpStatus.CREATED);
    expect(res.body).toMatchObject({
      id: expect.any(Number),
      city: 'Seoul',
      name: 'Test School',
    });

    const schoolPage = await testDataSource.manager.findOne(SchoolPageEntity, {
      where: { id: res.body.id },
    });

    expect(schoolPage).toMatchObject({
      city: 'Seoul',
      name: 'Test School',
    });
  });

  it('(DELETE) v1/school-pages/:id', async () => {
    // given
    const schoolPage = await testDataSource.manager.save(SchoolPageEntity, {
      city: City.SEOUL,
      name: 'Test School2',
    });

    // when
    const res = await request(app.getHttpServer()).delete(`/v1/school-pages/${schoolPage.id}`).set('Cookie', cookie);

    // then
    expect(res.statusCode).toEqual(HttpStatus.OK);

    const deletedSchoolPage = await testDataSource.manager.findOne(SchoolPageEntity, {
      where: { id: schoolPage.id },
    });

    expect(deletedSchoolPage).toBeNull();
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
    email: adminUserFixture[0].email,
    password: adminUserFixture[0].password,
    roleId: adminUserFixture[0].roleId,
  });
}
