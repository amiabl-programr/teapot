import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Teapot Microservice (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /v1/brew without key should return 401 Unauthorized', () => {
    return request(app.getHttpServer())
      .post('/v1/brew')
      .send({ teaType: 'Earl Grey' })
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('POST /v1/brew full request lifecycle returns 418', () => {
    return request(app.getHttpServer())
      .post('/v1/brew')
      .set('X-Teapot-Key', 'teamaster')
      .send({ teaType: 'Earl Grey' })
      .expect(HttpStatus.I_AM_A_TEAPOT)
      .expect((res) => {
        expect(res.body.status).toBe('refused');
        expect(res.body.teaRequested).toBe('Earl Grey');
        expect(res.body.brewed).toBe(false);
      });
  });

  it('GET /health/live returns tragically alive', () => {
    return request(app.getHttpServer())
      .get('/health/live')
      .expect(HttpStatus.OK)
      .expect({ status: 'alive', note: 'tragically' });
  });

  it('GET /metrics returns prometheus data', async () => {
    const res = await request(app.getHttpServer())
      .get('/metrics')
      .expect(HttpStatus.OK);
    
    expect(res.text).toContain('teapot_temperature_celsius 18');
  });

  it('POST /v1/brew triggers rate limit after 3 requests', async () => {
    // Already did 1 above, let's do 3 more to ensure hitting the 3/min limit
    for (let i = 0; i < 3; i++) {
        await request(app.getHttpServer())
            .post('/v1/brew')
            .set('X-Teapot-Key', 'admin')
            .send({ teaType: 'Matcha' });
    }
    
    // The 4th/5th overall should be 429 Too Many Requests
    return request(app.getHttpServer())
      .post('/v1/brew')
      .set('X-Teapot-Key', 'admin')
      .send({ teaType: 'Matcha' })
      .expect(HttpStatus.TOO_MANY_REQUESTS)
      .expect((res) => {
         expect(res.body.message).toContain('The kettle needs time to cool down.');
      });
  });
});
