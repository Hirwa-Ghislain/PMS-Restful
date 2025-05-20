const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    version: '1.0.0',
    title: 'Parking Management API',
    description: 'API documentation for Parking Management System',
  },
  host: 'localhost:5000',
  basePath: '/api/v1',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    { name: 'Auth', description: 'Authentication endpoints' },
    { name: 'Parkings', description: 'Parking location management endpoints' },
    { name: 'RegisterCars', description: 'Car registration and management endpoints' },
    { name: 'Bills', description: 'Billing and payment endpoints' },
    { name: 'Dashboard', description: 'Dashboard and profile endpoints' },
  ],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
    },
  },
};

const outputFile = './swagger-output.json';


const endpointsFiles = [
  './routes/authRoutes.js',
  './routes/parkingRoutes.js',
  './routes/registerCarRoutes.js',
  './routes/billRoutes.js',
  './routes/dashboardRoutes.js',
];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./server.js');
});
