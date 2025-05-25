import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator'
import { UserRole } from '@generated/prisma/index.js'

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  email!: string

  @ApiPropertyOptional({ example: 'John Doe', description: 'User display name' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string | null

  @ApiPropertyOptional({ enum: UserRole, example: UserRole.USER, description: 'User role' })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'newemail@example.com', description: 'New email address' })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiPropertyOptional({ example: 'New Name', description: 'New display name' })
  @IsOptional()
  @IsString()
  name?: string | null

  @ApiPropertyOptional({ enum: UserRole, example: UserRole.ADMIN, description: 'New user role' })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole
}

export class UserResponseDto {
  @ApiProperty({ example: 'cuid123', description: 'User ID' })
  id!: string

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  email!: string

  @ApiProperty({ example: 'John Doe', description: 'User name', nullable: true })
  name!: string | null

  @ApiProperty({ enum: UserRole, example: UserRole.USER, description: 'User role' })
  role!: UserRole

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Creation timestamp' })
  createdAt!: string

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Last update timestamp' })
  updatedAt!: string

  @ApiProperty({ example: null, description: 'Deletion timestamp', nullable: true })
  deletedAt!: string | null
}
