import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Minux.io API Documentation',
      version: '1.0.0',
      description: 'API documentation for Minux.io platform',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
      contact: {
        name: 'Minux.io Support',
        url: 'https://minux.io',
        email: 'support@minux.io',
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://web.minux.io'
          : 'http://localhost:3000',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/app/api/**/*.ts'],
};

// Use a function to generate specs to avoid issues with SSR
export const getSwaggerSpecs = () => {
  try {
    return swaggerJsdoc(options);
  } catch (error) {
    console.error('Error generating Swagger specs:', error);
    return { openapi: '3.0.0', info: { title: 'API Error', version: '1.0.0' }, paths: {} };
  }
};

export const isSwaggerEnabled = () => {
  // Access the store value directly - this works outside of React components
  try {
    const storeData = typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem('settings-storage') || '{}')
      : {};
    return storeData?.state?.enableSwaggerDocs !== false; // Default to true if not set
  } catch (error) {
    return process.env.NODE_ENV !== 'production'; // Fall back to enabled in dev, disabled in prod
  }
}; 