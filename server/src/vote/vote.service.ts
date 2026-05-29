import { Injectable, NotFoundException, BadRequestException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VoteService {
  constructor(private readonly prisma: PrismaService) {}

  async getVotes(potId: number) {
    try {
      const pot = await this.prisma.pot.findUnique({ where: { id: potId } });
      if (!pot) throw new NotFoundException('팟을 찾을 수 없습니다.');

      const votes = await this.prisma.vote.findMany({
        where: { potId },
        include: { options: true, createdBy: true },
        orderBy: { createdAt: 'desc' },
      });

      return votes.map(vote => ({
        ...vote,
        createdBy: vote.createdBy,
      }));
    } catch (error) {
      console.error('VoteService.getVotes error:', error);
      throw error;
    }
  }

  async createVote(potId: number, dto: { title: string; type: string; options: string[] }, userId: number) {
    const pot = await this.prisma.pot.findUnique({ where: { id: potId } });
    if (!pot) throw new NotFoundException('팟을 찾을 수 없습니다.');
    if (pot.creatorId !== userId) throw new ForbiddenException('투표는 팟 생성자만 만들 수 있습니다.');

    const title = dto.title?.trim();
    const options = (dto.options ?? []).map((option: string) => option?.trim()).filter(Boolean);

    if (!title) throw new BadRequestException('투표 제목을 입력하세요.');
    if (options.length < 2) throw new BadRequestException('투표 옵션을 2개 이상 입력하세요.');

    const created = await this.prisma.vote.create({
      data: {
        title,
        type: dto.type ?? '단일',
        pot: { connect: { id: potId } },
        createdBy: { connect: { id: userId } },
        options: {
          create: options.map(content => ({ content })),
        },
      },
      include: { options: true, createdBy: true },
    });

    return {
      ...created,
      createdBy: created.createdBy,
    };
  }

  async respondToVote(voteId: number, optionId: number, userId: number) {
    const vote = await this.prisma.vote.findUnique({ where: { id: voteId } });
    if (!vote) throw new NotFoundException('투표를 찾을 수 없습니다.');

    const pot = await this.prisma.pot.findUnique({ where: { id: vote.potId } });
    if (!pot) throw new NotFoundException('팟을 찾을 수 없습니다.');

    // 팟 creator이거나 승인된 참가자만 투표 가능
    if (pot.creatorId !== userId) {
      const approved = await this.prisma.application.findUnique({
        where: { potId_userId: { potId: pot.id, userId } },
      });
      if (!approved || approved.status !== 'approved') {
        throw new ForbiddenException('승인된 참가자만 투표에 참여할 수 있습니다.');
      }
    }

    const option = await this.prisma.voteOption.findUnique({ where: { id: optionId } });
    if (!option || option.voteId !== voteId) {
      throw new BadRequestException('유효하지 않은 투표 선택지입니다.');
    }

    const existing = await this.prisma.voteResponse.findUnique({
      where: { voteId_userId: { voteId, userId } },
    });
    if (existing) throw new ConflictException('이미 투표했습니다.');

    await this.prisma.voteResponse.create({
      data: {
        vote: { connect: { id: voteId } },
        option: { connect: { id: optionId } },
        user: { connect: { id: userId } },
      },
    });

    return { success: true };
  }

  async getVoteResults(voteId: number) {
    const vote = await this.prisma.vote.findUnique({ where: { id: voteId } });
    if (!vote) throw new NotFoundException('투표를 찾을 수 없습니다.');

    const options = await this.prisma.voteOption.findMany({
      where: { voteId },
      select: {
        id: true,
        _count: { select: { responses: true } },
      },
    });

    return options.map(option => ({
      optionId: option.id,
      count: option._count.responses,
    }));
  }
}
