import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { type App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Teapot Service (e2e)', () => {
  let app: INestApplication;
  let server: App;

  beforeAll(async () => {
    // 1) Public App
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
    server = app.getHttpServer() as App;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/v1/brew without key should return 401 Unauthorized', () => {
    return request(server)
      .post('/api/v1/brew')
      .send({ teaType: 'Earl Grey' })
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('POST /api/v1/brew full request lifecycle returns 418', () => {
    return request(server)
      .post('/api/v1/brew')
      .set('X-Teapot-Key', 'teamaster')
      .send({ teaType: 'Earl Grey' })
      .expect(HttpStatus.I_AM_A_TEAPOT)
      .expect((res) => {
        const body = res.body as {
          status: string;
          teaRequested: string;
          brewed: boolean;
        };
        expect(body.status).toBe('refused');
        expect(body.teaRequested).toBe('Earl Grey');
        expect(body.brewed).toBe(false);
      });
  });

  it('GET /api/health/live returns tragically alive', () => {
    return request(server)
      .get('/api/health/live')
      .expect(HttpStatus.OK)
      .expect({ status: 'alive', note: 'tragically' });
  });

  it('GET /metrics returns 404 on public app', async () => {
    await request(server).get('/metrics').expect(HttpStatus.NOT_FOUND);
  });

  it('POST /api/v1/brew triggers rate limit after 3 requests', async () => {
    // Already did 1 above, let's do 3 more to ensure hitting the 3/min limit
    for (let i = 0; i < 3; i++) {
      await request(server)
        .post('/api/v1/brew')
        .set('X-Teapot-Key', 'admin')
        .send({ teaType: 'Matcha' });
    }

    // The 4th/5th overall should be 429 Too Many Requests
    return request(server)
      .post('/api/v1/brew')
      .set('X-Teapot-Key', 'admin')
      .send({ teaType: 'Matcha' })
      .expect(HttpStatus.TOO_MANY_REQUESTS)
      .expect((res) => {
        const body = res.body as { message: string };
        expect(body.message).toContain('ThrottlerException: Too Many Requests');
      });
  });
});
