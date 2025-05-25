import { ApiProperty } from '@nestjs/swagger'

export class MemoryUsageDto {
  @ApiProperty({
    description: 'Used memory in MB',
    example: 128,
    type: 'number',
  })
  used!: number

  @ApiProperty({
    description: 'Total allocated memory in MB',
    example: 512,
    type: 'number',
  })
  total!: number
}

export class DatabaseStatusDto {
  @ApiProperty({
    description: 'Database connection status',
    enum: ['connected', 'disconnected', 'error'],
    example: 'connected',
  })
  status!: 'connected' | 'disconnected' | 'error'

  @ApiProperty({
    description: 'Database response time in milliseconds',
    example: 5,
    type: 'number',
  })
  latency!: number
}

export class HealthCheckResponseDto {
  @ApiProperty({
    description: 'Overall system health status',
    enum: ['ok', 'degraded', 'error'],
    example: 'ok',
  })
  status!: 'ok' | 'degraded' | 'error'

  @ApiProperty({
    description: 'Timestamp when health check was performed',
    example: '2024-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  timestamp!: string

  @ApiProperty({
    description: 'Server uptime in seconds',
    example: 3600,
    type: 'number',
  })
  uptime!: number

  @ApiProperty({
    description: 'Memory usage information',
    type: MemoryUsageDto,
  })
  memory!: MemoryUsageDto

  @ApiProperty({
    description: 'Database connectivity information',
    type: DatabaseStatusDto,
  })
  database!: DatabaseStatusDto

  @ApiProperty({
    description: 'Error message if health check failed',
    example: 'Health check failed',
    required: false,
    type: 'string',
  })
  error?: string
}

export class WelcomeResponseDto {
  @ApiProperty({
    description: 'Welcome message from the API',
    example: 'Hello World!',
    type: 'string',
  })
  message!: string
}
