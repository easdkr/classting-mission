import { AuthProvider, Role } from '@classting/auth/usecase/enums';
import { Maybe } from '@libs/functional';
import { HashService } from '@libs/hash';
import { RoleEntity, UserEntity } from '@classting/users/persistence/entities';
import { Test } from '@nestjs/testing';
import { mockDeep } from 'jest-mock-extended';
import { AuthService } from '@classting/auth/usecase/services/auth.service';
import { UserService } from '@classting/users/usecase/services';

describe('AuthService', () => {
  let authService: AuthService;
  const mockUserService = mockDeep<UserService>();
  const mockHashService = mockDeep<HashService>();

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: HashService,
          useValue: mockHashService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return true if user is valid', async () => {
      // given
      const mockRole = new RoleEntity();
      mockRole.id = 1;
      mockRole.name = Role.ADMIN;

      const mockUser = new UserEntity();
      mockUser.id = 1;
      mockUser.email = 'test@test.com';
      mockUser.password = 'password';
      mockUser.provider = AuthProvider.EMAIL;

      mockUser.role = mockRole;

      mockUserService.findOne.mockResolvedValue(Maybe.of(mockUser));
      mockHashService.compare.mockResolvedValue(true);

      // when
      const result = await authService.validateUser('test@test.com', 'password');

      // then
      expect(result).toEqual({
        id: 1,
        email: 'test@test.com',
        role: Role.ADMIN,
      });
    });
  });
});
