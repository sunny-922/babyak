import { Injectable, NotFoundException, ForbiddenException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ApplicationService {
  constructor(private prisma: PrismaService) {}

  async applyToPot(potId: number, userId: number, message: string) {
    // Prisma 트랜잭션으로 Race Condition 방지
    return this.prisma.$transaction(async (tx) => {
      const pot = await tx.pot.findUnique({ where: { id: potId } });
      if (!pot) throw new NotFoundException('팟을 찾을 수 없습니다.');
      if (pot.status === 'closed') throw new BadRequestException('모집이 마감된 팟입니다.');

      const existing = await tx.application.findUnique({
        where: { potId_userId: { potId, userId } },
      });
      if (existing) throw new ConflictException('이미 신청한 팟입니다.');

      const count = await tx.application.count({
        where: { potId, status: 'approved' },
      });
      if (count >= pot.maxPeople - 1) throw new BadRequestException('정원이 초과되었습니다.');

      return tx.application.create({ data: { potId, userId, message } });
    });
  }

  getApplications(potId: number) {
    return this.prisma.application.findMany({
      where: { potId },
      include: { user: { select: { nickname: true } } },
    });
  }

  async updateStatus(id: number, status: 'approved' | 'rejected', userId: number) {
    const app = await this.prisma.application.findUnique({
      where: { id },
      include: { pot: true },
    });
    if (!app) throw new NotFoundException();
    if (app.pot.creatorId !== userId) throw new ForbiddenException('권한이 없습니다.');
    return this.prisma.application.update({ where: { id }, data: { status } });
  }
}