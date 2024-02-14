import { initializeApplication } from '@classting/app.initializer';
import * as request from 'supertest';
import { AppModule } from '@classting/app.module';
import { RoleEntity } from '@classting/users/persistence/entities';
import { UserService } from '@classting/users/services';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { roleFixture, userFixture } from '@test/fixtures';
import { createDatabase, createTestDataSource } from '@test/utils/test-datasource';
import { IMemoryDb, IBackup } from 'pg-mem';
import { DataSource } from 'typeorm';

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

describe('AuthController (e2e)', () => {
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

  it('(POST) v1/auth/signin', async () => {
    const endpoint = '/v1/auth/signin';
    // given
    const body = {
      email: 'test@test.com',
      password: 'test1@',
    };

    // when
    const res = await request(app.getHttpServer()).post(endpoint).send(body);

    // then
    expect(res.statusCode).toEqual(201);
    expect(res.header['set-cookie']).toBeDefined();
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
}
