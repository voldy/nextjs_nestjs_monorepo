import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { BackendEnv } from '../env.ts'

export function setupSwagger(app: NestFastifyApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Monorepo API')
    .setDescription(
      `
      ## REST API Documentation
      
      This API provides REST endpoints for external integrations, webhooks, and third-party services.
      
      ### Authentication
      - Most endpoints require authentication
      - Use Bearer tokens in the Authorization header
      
      ### Rate Limiting
      - API requests are rate-limited per IP address
      - Check response headers for rate limit information
      
      ### Error Handling
      - All errors follow RFC 7807 Problem Details format
      - HTTP status codes follow REST conventions
      
      ### tRPC Integration
      For type-safe, real-time communication between frontend and backend, 
      this API also supports tRPC. See the main README for tRPC documentation.
    `,
    )
    .setVersion('1.0')
    .setContact('API Support', 'https://github.com/your-org/monorepo', 'support@yourcompany.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer(BackendEnv.BACKEND_URL, 'Development server')
    .addServer('https://api.yourcompany.com', 'Production server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Health', 'Health check and system status endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Webhooks', 'Webhook endpoints for external integrations')
    .build()

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  })

  // Setup Swagger UI
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
    customSiteTitle: 'Monorepo API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #3b82f6 }
    `,
    jsonDocumentUrl: 'api/docs/swagger.json',
    yamlDocumentUrl: 'api/docs/swagger.yaml',
  })
}
