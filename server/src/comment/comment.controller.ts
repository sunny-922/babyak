import { Controller, Get, Post, Delete, Param, Body, Request, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('pots/:potId/comments')
  getComments(@Param('potId') potId: string) {
    return this.commentService.getComments(Number(potId));
  }

  @UseGuards(JwtAuthGuard)
  @Post('pots/:potId/comments')
  createComment(@Param('potId') potId: string, @Body('content') content: string, @Request() req: any) {
    return this.commentService.createComment(Number(potId), req.user.id, content);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('comments/:id')
  deleteComment(@Param('id') id: string, @Request() req: any) {
    return this.commentService.deleteComment(Number(id), req.user.id);
  }
}
