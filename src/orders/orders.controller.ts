import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { Request } from 'express';
import { OrderDto } from 'src/dtos/order.dto';
import { DBService } from '../common/services/db.service';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: DBService) {}

  @Get()
  async findAll() {
    return await this.ordersService.getAllDocuments<OrderDto>('orders');
  }

  @Get(':orderId')
  async findById(@Param('orderId') orderId: string, @Req() req: Request) {
    console.log(req.uid);
    return await this.ordersService.getDocumentById('orders', orderId);
  }

  @Post()
  async create(@Body() dto: OrderDto) {
    const result = await this.ordersService.createDocument('orders', dto);
    return result;
  }

  @Put(':orderId')
  async update(
    @Body() dto: Partial<OrderDto>,
    @Param('orderId') orderId: string,
  ) {
    const result = await this.ordersService.updateDocumentById(
      'orders',
      orderId,
      dto,
    );
    return result;
  }
}
