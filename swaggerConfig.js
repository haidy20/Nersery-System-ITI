// Import necessary modules
const swaggerJsdoc = require('swagger-jsdoc');

// Define Swagger information
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Nersery API',
    //   description: 'API documentation for managing Nersery System',
      version: '1.0.0',
    },
    servers: [
        {
            url: 'http://localhost:8080/',
        },
        ],
  },
  apis: ['./Controller/*js'],
};

// Step 3: Generate Swagger documentation
const swaggerSpec = swaggerJsdoc(swaggerOptions);
module.exports = swaggerSpec;