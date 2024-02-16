import { HashService } from '@libs/hash';
import { UserEntity } from '@classting/users/persistence/entities';
import { Repository } from 'typeorm';
import { mockDeep } from 'jest-mock-extended';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RoleQueryRepository, UserQueryRepository } from '@classting/users/persistence/repositories';
import { UserService } from '@classting/users/usecase/services/user.service';
import { CreateUserCommand } from '@classting/users/usecase/dtos/commands';

describe('UserService', () => {
  let userService: UserService;
  const mockUserRepository = mockDeep<Repository<UserEntity>>();
  const mockHashService = mockDeep<HashService>();
  const mockUserQueryRepository = mockDeep<UserQueryRepository>();
  const mockRoleQueryRepository = mockDeep<RoleQueryRepository>();

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
        {
          provide: HashService,
          useValue: mockHashService,
        },
        {
          provide: UserQueryRepository,
          useValue: mockUserQueryRepository,
        },
        {
          provide: RoleQueryRepository,
          useValue: mockRoleQueryRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      // given
      const command: CreateUserCommand = {
        email: 'test@test.com',
        password: 'password',
        roleId: 1,
      };

      const hashedPassword = 'hashedPassword';
      mockHashService.hash.mockResolvedValueOnce(hashedPassword);
      mockRoleQueryRepository.existsById.mockResolvedValueOnce(true);
      mockUserQueryRepository.existsByEmail.mockResolvedValueOnce(false);

      // when
      await userService.create(command);

      // then
      expect(mockHashService.hash).toHaveBeenCalledWith(command.password);
      expect(mockUserRepository.save).toHaveBeenCalledWith(
        {
          email: command.email,
          password: hashedPassword,
          roleId: command.roleId,
        },
        expect.anything(),
      );
    });

    it('should throw an error when an email already exists', async () => {
      // given
      const command: CreateUserCommand = {
        email: 'test@test.com',
        password: 'password',
        roleId: 1,
      };

      const hashedPassword = 'hashedPassword';
      mockHashService.hash.mockResolvedValueOnce(hashedPassword);
      mockRoleQueryRepository.existsById.mockResolvedValueOnce(true);
      mockUserQueryRepository.existsByEmail.mockResolvedValueOnce(true);

      // when
      const received = userService.create(command);

      // then
      await expect(received).rejects.toThrow('Email already exists');
    });

    it('should throw an error when a role does not exist', async () => {
      // given
      const command: CreateUserCommand = {
        email: 'test@test.com',
        password: 'password',
        roleId: 1,
      };

      const hashedPassword = 'hashedPassword';
      mockHashService.hash.mockResolvedValueOnce(hashedPassword);
      mockRoleQueryRepository.existsById.mockResolvedValueOnce(false);
      mockUserQueryRepository.existsByEmail.mockResolvedValueOnce(false);

      // when
      const received = userService.create(command);

      // then
      await expect(received).rejects.toThrow('Role does not exist');
    });
  });
});
