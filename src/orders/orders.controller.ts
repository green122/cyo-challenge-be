import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Request } from 'express';
import { OrderDto } from 'src/dtos/order.dto';
import { DBService } from '../common/services/db.service';

@Controller('orders')
export class OrdersController {
  constructor(private dbService: DBService) {}

  @Get()
  async findAll() {
    const result = await this.dbService.getAllDocuments<OrderDto>('orders');
    return result;
  }

  @Get(':orderId')
  async findById(@Param('orderId') orderId: string) {
    const result = await this.dbService.getDocumentById('orders', orderId);
    if (!result) {
      throw new NotFoundException(`order with id ${orderId} not found`);
    }
    return result;
  }

  @Post()
  async create(@Body() dto: OrderDto, @Req() req: Request) {
    const result = await this.dbService.createDocument('orders', {
      ...dto,
      uid: req.uid,
    });
    return { id: result };
  }

  @Put(':orderId')
  async update(
    @Body() dto: Partial<OrderDto>,
    @Param('orderId') orderId: string,
  ) {
    if (!dto) {
      throw new UnprocessableEntityException('Wrong data passed');
    }
    try {
      const result = await this.dbService.updateDocumentById(
        'orders',
        orderId,
        dto,
      );
      if (!result) {
        return new NotFoundException(`order with id ${orderId} not found`);
      }
      return { success: true };
    } catch (error) {
      // TODO: to think about more keen response
      throw new InternalServerErrorException(
        'Something bad has happened',
        error,
      );
    }
  }
}
