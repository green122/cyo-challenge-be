import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { DBService } from '../common/services/db.service';

@Module({
  controllers: [OrdersController],
  providers: [DBService],
  exports: [DBService],
})
export class OrdersModule {}
