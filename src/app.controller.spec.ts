import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  const mockService = {
    getHealth: jest.fn().mockReturnValue({
      status: "ok",
      uptime: 1,
      timestamp: "2025-01-01T00:00:00.000Z",
      db: "connected",
    }),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: mockService }],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should return health payload', () => {
    const result = appController.getHealth();
    expect(result).toEqual({
      message: "ok",
      data: mockService.getHealth(),
    });
  });
});
