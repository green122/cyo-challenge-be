import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from '../common/services/db.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
