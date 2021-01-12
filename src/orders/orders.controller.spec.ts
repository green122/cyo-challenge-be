import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { DBService } from '../common/services/db.service';
import { OrdersController } from './orders.controller';

const dbService = {
  getAllDocuments: () => ['test'],
  getDocumentById: jest.fn(() => ({ data: 'order' })),
};

describe('OrdersController', () => {
  let controller: OrdersController;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [{ provide: DBService, useValue: dbService }],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);

    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('/GET orders should return an array from db', () => {
    return request(app.getHttpServer())
      .get('/orders')
      .expect(200)
      .expect(dbService.getAllDocuments());
  });

  it('/GET order by id should return mocked order from db', () => {
    const result = request(app.getHttpServer())
      .get('/orders/fakeId')
      .expect(200)
      .expect(dbService.getDocumentById());

    expect(dbService.getDocumentById).toHaveBeenCalled();
    return result;
  });
});
