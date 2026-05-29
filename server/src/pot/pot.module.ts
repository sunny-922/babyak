import { Module } from '@nestjs/common';
import { PotController } from './pot.controller';
import { PotService } from './pot.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PotController],
  providers: [PotService],
})
export class PotModule {}
