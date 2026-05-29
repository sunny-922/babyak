import { Controller, Get, Post, Param, Body, Request, UseGuards } from '@nestjs/common';
import { VoteService } from './vote.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Get('pots/:potId/votes')
  getVotes(@Param('potId') potId: string) {
    return this.voteService.getVotes(Number(potId));
  }

  @UseGuards(JwtAuthGuard)
  @Post('pots/:potId/votes')
  createVote(@Param('potId') potId: string, @Body() dto: any, @Request() req: any) {
    return this.voteService.createVote(Number(potId), dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('votes/:voteId/responses')
  respondToVote(@Param('voteId') voteId: string, @Body('optionId') optionId: number, @Request() req: any) {
    return this.voteService.respondToVote(Number(voteId), Number(optionId), req.user.id);
  }

  @Get('votes/:voteId/results')
  getVoteResults(@Param('voteId') voteId: string) {
    return this.voteService.getVoteResults(Number(voteId));
  }
}
