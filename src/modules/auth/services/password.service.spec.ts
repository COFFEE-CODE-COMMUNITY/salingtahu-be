import { Test } from '@nestjs/testing'
import { PasswordService } from './password.service'
import { ConfigService } from '@nestjs/config';
import { mock, MockProxy } from "jest-mock-extended"

describe('PasswordService', () => {
  let service: PasswordService
  let configService: MockProxy<ConfigService>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PasswordService,
        {
          provide: ConfigService,
          useValue: mock<ConfigService>()
        }
      ],
    }).compile()

    service = module.get<PasswordService>(PasswordService)
    configService = module.get<MockProxy<ConfigService>>(ConfigService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('hash', () => {
    it('should hash a password using argon2id by default', async () => {
      const password = 'testPassword123'
      configService.get.mockImplementation(
        (key: string, defaultValue?: any) => {
          switch (key) {
            case 'password.argon2.type':
              return 'argon2id';
            case 'password.argon2.memoryCost':
              return 8192;
            case 'password.argon2.timeCost':
              return 2;
            case 'password.argon2.parallelism':
              return 1;
            default:
              return defaultValue;
          }
        },
      )

      const hashedPassword = await service.hash(password)

      expect(hashedPassword).toBeDefined()
      expect(typeof hashedPassword).toBe('string')
      expect(hashedPassword).not.toBe(password)
      expect(hashedPassword).toContain('$argon2id$')
    })

    it('should hash a password using argon2d when configured', async () => {
      const password = 'testPassword123'
      configService.get.mockImplementation((key: string, defaultValue?: any) => {
        if (key === 'password.argon2.type') return 'argon2d'
        return defaultValue
      })

      const hashedPassword = await service.hash(password)

      expect(hashedPassword).toBeDefined()
      expect(hashedPassword).toContain('$argon2d$')
    })

    it('should hash a password using argon2i when configured', async () => {
      const password = 'testPassword123'
      configService.get.mockImplementation((key: string, defaultValue?: any) => {
        if (key === 'password.argon2.type') return 'argon2i'
        return defaultValue
      })

      const hashedPassword = await service.hash(password)

      expect(hashedPassword).toBeDefined()
      expect(hashedPassword).toContain('$argon2i$')
    })

    it('should use custom configuration parameters when provided', async () => {
      const password = 'testPassword123'
      configService.get.mockImplementation((key: string, defaultValue?: any) => {
        if (key === 'password.argon2.type') return 'argon2id'
        if (key === 'password.argon2.memoryCost') return 16384
        if (key === 'password.argon2.timeCost') return 3
        if (key === 'password.argon2.parallelism') return 2
        return defaultValue
      })

      const hashedPassword = await service.hash(password)

      expect(hashedPassword).toBeDefined()
      expect(configService.get).toHaveBeenCalledWith('password.argon2.type', 'argon2id')
      expect(configService.get).toHaveBeenCalledWith('password.argon2.memoryCost', 8192)
      expect(configService.get).toHaveBeenCalledWith('password.argon2.timeCost', 2)
      expect(configService.get).toHaveBeenCalledWith('password.argon2.parallelism', 1)
    })

    it('should throw an error for unsupported algorithm type', async () => {
      const password = 'testPassword123'
      configService.get.mockImplementation((key: string, defaultValue?: any) => {
        if (key === 'password.argon2.type') return 'unsupported'
        return defaultValue
      })

      await expect(service.hash(password)).rejects.toThrow('Algorithm unsupported is not supported.')
    })

    it('should handle uppercase algorithm type', async () => {
      const password = 'testPassword123'
      configService.get.mockImplementation((key: string, defaultValue?: any) => {
        if (key === 'password.argon2.type') return 'ARGON2ID'
        return defaultValue
      })

      const hashedPassword = await service.hash(password)

      expect(hashedPassword).toBeDefined()
      expect(hashedPassword).toContain('$argon2id$')
    })

    it('should produce different hashes for the same password', async () => {
      const password = 'testPassword123'
      configService.get.mockImplementation(
        (key: string, defaultValue?: any) => {
          switch (key) {
            case 'password.argon2.type':
              return 'argon2id';
            case 'password.argon2.memoryCost':
              return 8192;
            case 'password.argon2.timeCost':
              return 2;
            case 'password.argon2.parallelism':
              return 1;
            default:
              return defaultValue;
          }
        },
      )

      const hash1 = await service.hash(password)
      const hash2 = await service.hash(password)

      expect(hash1).not.toBe(hash2)
    })
  })

  describe('compare', () => {
    it('should return true when password matches hashed password', async () => {
      const password = 'testPassword123'
      configService.get.mockImplementation(
        (key: string, defaultValue?: any) => {
          switch (key) {
            case 'password.argon2.type':
              return 'argon2id';
            case 'password.argon2.memoryCost':
              return 8192;
            case 'password.argon2.timeCost':
              return 2;
            case 'password.argon2.parallelism':
              return 1;
            default:
              return defaultValue;
          }
        },
      )

      const hashedPassword = await service.hash(password)
      const result = await service.compare(password, hashedPassword)

      expect(result).toBe(true)
    })

    it('should return false when password does not match hashed password', async () => {
      const password = 'testPassword123'
      const wrongPassword = 'wrongPassword456'
      configService.get.mockImplementation(
        (key: string, defaultValue?: any) => {
          switch (key) {
            case 'password.argon2.type':
              return 'argon2id';
            case 'password.argon2.memoryCost':
              return 8192;
            case 'password.argon2.timeCost':
              return 2;
            case 'password.argon2.parallelism':
              return 1;
            default:
              return defaultValue;
          }
        },
      )

      const hashedPassword = await service.hash(password)
      const result = await service.compare(wrongPassword, hashedPassword)

      expect(result).toBe(false)
    })

    it('should return false for empty password', async () => {
      const password = 'testPassword123'
      configService.get.mockImplementation(
        (key: string, defaultValue?: any) => {
          switch (key) {
            case 'password.argon2.type':
              return 'argon2id';
            case 'password.argon2.memoryCost':
              return 8192;
            case 'password.argon2.timeCost':
              return 2;
            case 'password.argon2.parallelism':
              return 1;
            default:
              return defaultValue;
          }
        },
      )

      const hashedPassword = await service.hash(password)
      const result = await service.compare('', hashedPassword)

      expect(result).toBe(false)
    })

    it('should handle case-sensitive password comparison', async () => {
      const password = 'TestPassword123'
      configService.get.mockImplementation(
        (key: string, defaultValue?: any) => {
          switch (key) {
            case 'password.argon2.type':
              return 'argon2id';
            case 'password.argon2.memoryCost':
              return 8192;
            case 'password.argon2.timeCost':
              return 2;
            case 'password.argon2.parallelism':
              return 1;
            default:
              return defaultValue;
          }
        },
      )

      const hashedPassword = await service.hash(password)
      const result = await service.compare('testpassword123', hashedPassword)

      expect(result).toBe(false)
    })

    it('should verify password hashed with different argon2 types', async () => {
      const password = 'testPassword123'

      // Hash with argon2d
      configService.get.mockImplementation((key: string, defaultValue?: any) => {
        if (key === 'password.argon2.type') return 'argon2d'
        return defaultValue
      })
      const hashedWithArgon2d = await service.hash(password)

      // Verify should work regardless of current config
      configService.get.mockReturnValue(undefined)
      const result = await service.compare(password, hashedWithArgon2d)

      expect(result).toBe(true)
    })
  })
})