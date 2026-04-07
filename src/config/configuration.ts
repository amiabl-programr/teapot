/**
 * Central configuration providing all highly essential settings.
 */
export default () => ({
  port: parseInt(process.env.PORT || '4180', 10),
  apiKeys: ['guest', 'admin', 'teamaster'],
  rateLimit: {
    ttl: 60,
    limit: 3,
  },
  teapot: {
    defaultTea: 'Earl Grey',
    waterLevel: 0.0,
    temperatureCelsius: 18.0,
    inventory: 0,
  },
  telemetry: {
    serviceName: 'teapot-microservice',
    otlpEndpoint: process.env.OTLP_ENDPOINT || 'http://localhost:4318',
  },
});
