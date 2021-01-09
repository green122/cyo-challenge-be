import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrderDto } from 'src/dtos/order.dto';
import { OrdersService } from '../common/services/db.service';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  async findAll() {
    return await this.ordersService.getAllDocuments<OrderDto>('orders');
  }

  @Get(':orderId')
  async findById(@Param('orderId') orderId: string) {
    return await this.ordersService.getDocumentById('orders', orderId);
  }

  @Post()
  async create(@Body() dto: OrderDto) {
    const result = await this.ordersService.createDocument('orders', dto);
    return result;
  }
}
