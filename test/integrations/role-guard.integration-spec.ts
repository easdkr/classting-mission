import { Controller, Get, INestApplication, UseGuards } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { createDatabase, createTestDataSource } from '@test/utils/test-datasource';
import { IBackup, IMemoryDb } from 'pg-mem';
import { RoleEntity } from '@classting/users/persistence/entities';
import { roleFixture, userFixture } from '@test/fixtures';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@classting/app.module';
import { initializeApplication } from '@libs/configs';
import { RoleGuard } from '@classting/auth/presentation/guards';
import { UserService } from '@classting/users/usecase/services';
import { UseRole } from '@libs/decorators/role.decorator';
import { Role } from '@classting/auth/usecase/enums';

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

describe('RoleGuard (integration)', () => {
  @Controller({ path: 'tests', version: '1' })
  @UseRole(Role.ADMIN)
  class TestController {
    @Get()
    @UseGuards(RoleGuard)
    test() {
      return 'ok';
    }
  }

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [TestController],
    })
      .overrideProvider(DataSource)
      .useValue(testDataSource)
      .compile();

    app = moduleFixture.createNestApplication();

    initializeApplication(app);
    await app.init();
    await setupFixture(testDataSource);
  });

  it('should return 200 when authenticated', async () => {
    const endpoint = '/v1/auth/signin';
    // given
    const body = {
      email: 'test@test.com',
      password: 'test1@',
    };
    const signinRes = await request(app.getHttpServer()).post(endpoint).send(body);
    const cookie = signinRes.header['set-cookie'];

    // when
    const res = await request(app.getHttpServer()).get('/v1/tests').set('Cookie', cookie);

    // then
    expect(res.statusCode).toEqual(200);
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
    roleId: 1,
  });
}
