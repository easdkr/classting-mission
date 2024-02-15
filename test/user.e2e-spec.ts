import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { createDatabase, createTestDataSource } from '@test/utils/test-datasource';
import { IBackup, IMemoryDb } from 'pg-mem';
import { RoleEntity, UserEntity } from '@classting/users/persistence/entities';
import { roleFixture } from '@test/fixtures';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@classting/app.module';
import { CreateUserBody } from '@classting/users/controllers/dtos/requests';
import { plainToInstance } from 'class-transformer';
import { initializeApplication } from '@libs/configs';

let memDB: IMemoryDb;
let testDataSource: DataSource;
let backup: IBackup;
let moduleFixture: TestingModule;

beforeAll(async () => {
  await initializeTest();
});

afterAll(async () => {
  await clearTest();
});

describe('UserController (e2e)', () => {
  let app: INestApplication;

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

  it('(POST) v1/users', async () => {
    // given
    const body = plainToInstance(CreateUserBody, {
      email: 'test@test.com',
      password: 'test1@',
      roleId: 1,
    });

    // when
    const res = await request(app.getHttpServer()).post('/v1/users').send(body);

    // then
    expect(res.statusCode).toEqual(HttpStatus.CREATED);

    const createdUser = await testDataSource.manager.findOne(UserEntity, { where: { email: body.email } });
    expect(createdUser).toBeInstanceOf(UserEntity);
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
}
