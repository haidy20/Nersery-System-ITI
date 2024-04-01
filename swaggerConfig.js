// Step 1: Import necessary modules
// const express = require('express');
// const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Step 2: Define Swagger information
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
            url: 'http://localhost:8080/', // Change this to your server URL
        },
        ],
  },
  apis: ['./Controller/*js'], // Path to the routes where Swagger annotations are defined
};

// Step 3: Generate Swagger documentation
const swaggerSpec = swaggerJsdoc(swaggerOptions);
module.exports = swaggerSpec;
// Step 4: Create Express app
// const app = express();

// Step 5: Serve Swagger documentation

// Define your routes and controllers

// Step 6: Start the server
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });