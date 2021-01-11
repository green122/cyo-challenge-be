import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
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
  async findById(@Param('orderId') orderId: string) {
    const result = await this.ordersService.getDocumentById('orders', orderId);
    if (!result) {
      throw new NotFoundException(`order with id ${orderId} not found`);
    }
    return result;
  }

  @Post()
  async create(@Body() dto: OrderDto) {
    const result = await this.ordersService.createDocument('orders', dto);
    return { id: result };
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
