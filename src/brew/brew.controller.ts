import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { BrewService } from './brew.service';
import { BrewRequestDto } from './dto/brew-request.dto';
import { BrewResponseDto } from './dto/brew-response.dto';
import { TeapotKeyGuard } from '../auth/guards/teapot-key.guard';
import { winstonLogger } from '../common/logger/winston.logger';

/**
 * Controller handling the brewing endpoints.
 * Provides multiple avenues for clients to be rejected.
 *
 * @class BrewController
 */
@ApiTags('brew')
@UseGuards(TeapotKeyGuard)
@ApiHeader({
  name: 'X-Teapot-Key',
  description:
    'Authentication key to receive your refusal. Valid keys: guest, admin, teamaster',
  required: true,
})
@Controller()
export class BrewController {
  /**
   * Instantiates the BrewController.
   *
   * @param {BrewService} brewService The core refusal logic service
   */
  constructor(private readonly brewService: BrewService) {}

  /**
   * Attempt to brew tea (will always fail).
   *
   * @param {BrewRequestDto} brewRequest The brewing parameters
   * @returns {BrewResponseDto} The refusal payload
   */
  @Post('v1/brew')
  @HttpCode(HttpStatus.I_AM_A_TEAPOT)
  @ApiOperation({ summary: 'Attempt to brew tea (will always fail)' })
  @ApiResponse({
    status: 418,
    description: 'The only possible outcome',
    type: BrewResponseDto,
  })
  public brewTea(@Body() brewRequest: BrewRequestDto): void {
    winstonLogger.log('Received a request to brew tea', 'BrewController');
    this.brewService.brew(brewRequest);
  }

  /**
   * Sunset V2 brew endpoint.
   *
   * @returns {void}
   */
  @Get('v2/brew')
  @HttpCode(HttpStatus.GONE)
  @ApiOperation({ summary: 'Attempt to brew tea via V2 (deprecated)' })
  @ApiResponse({ status: 410, description: 'Endpoint is gone' })
  public brewTeaV2(): void {
    throw new HttpException(
      'This version was sunset in Q3. Please migrate to v1.',
      HttpStatus.GONE,
    );
  }

  /**
   * Blasphemous endpoint requesting coffee.
   *
   * @returns {void}
   */
  @Post('v1/brew/coffee')
  @HttpCode(HttpStatus.I_AM_A_TEAPOT)
  @ApiOperation({ summary: 'Request coffee (strongly discouraged)' })
  @ApiResponse({ status: 418, description: 'Absolutely not' })
  public brewCoffee(): void {
    throw new HttpException(
      {
        message:
          'Absolutely not. Coffee request denied. This is a teapot — rejection is our only protocol.',
      },
      HttpStatus.I_AM_A_TEAPOT,
    );
  }
}
