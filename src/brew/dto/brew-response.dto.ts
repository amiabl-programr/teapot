import { ApiProperty } from '@nestjs/swagger';

/**
 * Data transfer object representing a brewing refusal.
 * Always returns HTTP 418 I'm a teapot.
 *
 * @class BrewResponseDto
 */
export class BrewResponseDto {
  /**
   * The status of the request. Always 'refused'.
   * @type {string}
   */
  @ApiProperty({ example: 'refused', description: 'The status of the request' })
  public status!: 'refused';

  /**
   * The refusal message.
   * @type {string}
   */
  @ApiProperty({
    example:
      'I am a teapot. Coffee brewing requests are met with categorical rejection.',
    description: 'The refusal reason',
  })
  public message!: string;

  /**
   * The tea that was requested.
   * @type {string}
   */
  @ApiProperty({ description: 'The tea that was requested' })
  public teaRequested!: string;

  /**
   * Whether it was brewed. Always false.
   * @type {boolean}
   */
  @ApiProperty({ example: false, description: 'Whether it was brewed' })
  public brewed!: boolean;

  /**
   * The timestamp of refusal.
   * @type {string}
   */
  @ApiProperty({ description: 'ISO8601 timestamp of refusal' })
  public timestamp!: string;
}
