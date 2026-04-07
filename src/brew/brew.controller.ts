import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { BrewService } from './brew.service';
import { BrewRequestDto } from './dto/brew-request.dto';
import { BrewResponseDto } from './dto/brew-response.dto';
import { TeapotKeyGuard } from '../auth/guards/teapot-key.guard';
import { MetricsService } from '../metrics/metrics.service';

/**
 * Controller handling the brewing endpoints.
 * Provides multiple avenues for clients to be rejected.
 *
 * @class BrewController
 */
@ApiTags('brew')
@UseGuards(TeapotKeyGuard)
@ApiHeader({ name: 'X-Teapot-Key', description: 'Authentication key to receive your refusal. Valid keys: guest, admin, teamaster', required: true })
@Controller()
export class BrewController {
  /**
   * Instantiates the BrewController.
   *
   * @param {BrewService} brewService The core refusal logic service
   * @param {MetricsService} metricsService The metrics tracking service
   */
  constructor(
    private readonly brewService: BrewService,
    private readonly metricsService: MetricsService,
  ) {}

  /**
   * Attempt to brew tea (will always fail).
   *
   * @param {BrewRequestDto} brewRequest The brewing parameters
   * @returns {BrewResponseDto} The refusal payload
   */
  @Post('v1/brew')
  @HttpCode(HttpStatus.I_AM_A_TEAPOT)
  @ApiOperation({ summary: 'Attempt to brew tea (will always fail)' })
  @ApiResponse({ status: 418, description: 'The only possible outcome', type: BrewResponseDto })
  public brewTea(@Body() brewRequest: BrewRequestDto): BrewResponseDto {
    return this.brewService.brew(brewRequest);
  }

  /**
   * Sunset V2 brew endpoint.
   *
   * @returns {never}
   */
  @Get('v2/brew')
  @HttpCode(HttpStatus.GONE)
  @ApiOperation({ summary: 'Attempt to brew tea via V2 (deprecated)' })
  @ApiResponse({ status: 410, description: 'Endpoint is gone' })
  public brewTeaV2(): never {
    throw new HttpException('This version was sunset in Q3. Please migrate to v1.', HttpStatus.GONE);
  }

  /**
   * Blasphemous endpoint requesting coffee.
   *
   * @returns {never}
   */
  @Post('v1/brew/coffee')
  @HttpCode(HttpStatus.I_AM_A_TEAPOT)
  @ApiOperation({ summary: 'Request coffee (strongly discouraged)' })
  @ApiResponse({ status: 418, description: 'Absolutely not' })
  public brewCoffee(): never {
    this.metricsService.coffeeRequestsTotal.inc();
    throw new HttpException({ message: 'Absolutely not. I am a teapot.' }, HttpStatus.I_AM_A_TEAPOT);
  }
}
