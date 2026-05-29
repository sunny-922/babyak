import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  getComments(potId: number) {
    return this.prisma.comment.findMany({
      where: { potId },
      include: { user: { select: { nickname: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  createComment(potId: number, userId: number, content: string) {
    return this.prisma.comment.create({
      data: { potId, userId, content },
      include: { user: { select: { nickname: true } } },
    });
  }

  async deleteComment(id: number, userId: number) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('댓글을 찾을 수 없습니다.');
    if (comment.userId !== userId) throw new ForbiddenException('권한이 없습니다.');
    return this.prisma.comment.delete({ where: { id } });
  }
}
