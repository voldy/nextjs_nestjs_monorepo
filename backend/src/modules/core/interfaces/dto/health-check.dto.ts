import { ApiProperty } from '@nestjs/swagger'

export class HealthCheckDto {
  @ApiProperty({ example: 'ok', description: 'Overall system status' })
  status!: string

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Current timestamp' })
  timestamp!: string

  @ApiProperty({ example: 123.45, description: 'Server uptime in seconds' })
  uptime!: number

  @ApiProperty({
    example: { used: 50, total: 100 },
    description: 'Memory usage in MB',
  })
  memory!: {
    used: number
    total: number
  }

  @ApiProperty({
    example: { status: 'connected', latency: 5 },
    description: 'Database connection status and latency',
  })
  database!: {
    status: string
    latency: number
  }
}
