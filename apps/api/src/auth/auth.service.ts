import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUser, LoginInput, RegisterInput } from '@better-days/shared';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './auth.constants';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    input: RegisterInput,
  ): Promise<{ user: AuthUser; token: string }> {
    const existing = await this.usersService.findByEmail(input.email);
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
    const user = await this.usersService.create(input.email, passwordHash);

    return { user: this.toAuthUser(user), token: await this.signToken(user) };
  }

  async login(input: LoginInput): Promise<{ user: AuthUser; token: string }> {
    const user = await this.usersService.findByEmail(input.email);
    const passwordMatches =
      user && (await bcrypt.compare(input.password, user.passwordHash));

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return { user: this.toAuthUser(user), token: await this.signToken(user) };
  }

  async getAuthUser(userId: string): Promise<AuthUser> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.toAuthUser(user);
  }

  private signToken(user: User): Promise<string> {
    const payload: JwtPayload = { sub: user.id, email: user.email };
    return this.jwtService.signAsync(payload);
  }

  private toAuthUser(user: User): AuthUser {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
