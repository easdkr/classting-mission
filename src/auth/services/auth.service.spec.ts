import { AuthProvider } from '@classting/auth/enums';
import { AuthService } from '@classting/auth/services/auth.service';
import { Maybe } from '@classting/common/functional';
import { HashService } from '@classting/hash';
import { UserEntity } from '@classting/users/persistence/entities';
import { UserService } from '@classting/users/services';
import { Test } from '@nestjs/testing';
import { mockDeep } from 'jest-mock-extended';

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
      const mockUser = new UserEntity();
      mockUser.id = 1;
      mockUser.email = 'test@test.com';
      mockUser.password = 'password';
      mockUser.provider = AuthProvider.EMAIL;
      mockUser.roleId = 1;

      mockUserService.findOne.mockResolvedValue(Maybe.of(mockUser));
      mockHashService.compare.mockResolvedValue(true);

      // when
      const result = await authService.validateUser('test@test.com', 'password');

      // then
      expect(result).toEqual({
        id: 1,
        email: 'test@test.com',
      });
    });
  });
});
