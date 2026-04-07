import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MenuService } from './menu.service';

/**
 * Controller exposing the tea menu.
 */
@ApiTags('menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  /**
   * Returns the menu. Note: None of these options affect brew outcomes.
   *
   * @returns {object} The menu object.
   */
  @Get()
  @ApiOperation({ summary: 'Get the tea menu' })
  @ApiResponse({ status: 200, description: 'The tea menu with a disclaimer.' })
  getMenu() {
    return {
      note: 'None of these options affect brew outcomes.',
      menu: this.menuService.getMenu(),
    };
  }
}
