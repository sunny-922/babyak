import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PotService {
  constructor(private prisma: PrismaService) {}

  getPots(search: string, filter: string) {
    return this.prisma.pot.findMany({
      where: {
        ...(search ? { OR: [
          { title: { contains: search } },
          { place: { contains: search } },
        ]} : {}),
        ...(filter === 'open' ? { status: 'open' } : {}),
      },
      include: { creator: { select: { nickname: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPotById(potId: number) {
    const pot = await this.prisma.pot.findUnique({
      where: { id: potId },
      include: { creator: { select: { nickname: true } } },
    });
    if (!pot) throw new NotFoundException('팟을 찾을 수 없습니다.');
    return pot;
  }

  async createPot(dto: any, userId: number) {
    const created = await this.prisma.pot.create({
      data: { ...dto, creatorId: userId, meetingTime: new Date(dto.meetingTime) },
    });
    console.log('Created pot id:', created.id);
    return created;
  }

  async updatePot(potId: number, dto: any, userId: number) {
    const pot = await this.prisma.pot.findUnique({ where: { id: potId } });
    if (!pot) throw new NotFoundException();
    if (pot.creatorId !== userId) throw new ForbiddenException('수정 권한이 없습니다.');
    return this.prisma.pot.update({ where: { id: potId }, data: dto });
  }

  async deletePot(potId: number, userId: number) {
    const pot = await this.prisma.pot.findUnique({ where: { id: potId } });
    if (!pot) throw new NotFoundException();
    if (pot.creatorId !== userId) throw new ForbiddenException('삭제 권한이 없습니다.');
    return this.prisma.pot.delete({ where: { id: potId } });
  }
}