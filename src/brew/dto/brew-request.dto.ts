import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
  IsBoolean,
} from 'class-validator';

/**
 * Data transfer object representing a brewing request.
 * Contains meticulously validated fields that are entirely ignored.
 *
 * @class BrewRequestDto
 */
export class BrewRequestDto {
  /**
   * The type of tea to brew.
   * @type {string}
   */
  @ApiProperty({ description: 'The type of tea to brew', example: 'Earl Grey' })
  @IsString()
  @IsNotEmpty()
  public teaType!: string;

  /**
   * The requested temperature in Celsius.
   * @type {number}
   */
  @ApiPropertyOptional({
    description: 'The requested temperature in Celsius',
    example: 95,
  })
  @IsNumber()
  @IsOptional()
  public temperature?: number;

  /**
   * The requested sugar level (0-10).
   * @type {number}
   */
  @ApiPropertyOptional({
    description: 'The requested sugar level (0-10)',
    minimum: 0,
    maximum: 10,
    example: 2,
  })
  @IsNumber()
  @Min(0)
  @Max(10)
  @IsOptional()
  public sugarLevel?: number;

  /**
   * Whether milk is requested.
   * @type {boolean}
   */
  @ApiPropertyOptional({
    description: 'Whether milk is requested',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  public milk?: boolean;
}
