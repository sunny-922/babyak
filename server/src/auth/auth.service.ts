import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signup(dto: {
    username: string; password: string;
    nickname: string; studentNumber: string;
  }) {
    const existing = await this.prisma.user.findUnique({ where: { username: dto.username } });
    if (existing) throw new ConflictException('이미 사용 중인 아이디입니다.');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: { username: dto.username, nickname: dto.nickname, studentNumber: dto.studentNumber, passwordHash },
      select: { id: true, username: true, nickname: true, studentNumber: true },
    });
  }

  async login(dto: { username: string; password: string }) {
    const user = await this.prisma.user.findUnique({ where: { username: dto.username } });
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash)))
      throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않습니다.');

    const token = this.jwt.sign({ id: user.id, username: user.username });
    return { token, nickname: user.nickname };
  }
}