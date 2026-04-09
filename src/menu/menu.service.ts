import { Injectable } from '@nestjs/common';

export interface TeaMenuItem {
  name: string;
  description: string;
  steepTimeMinutes: number;
  temperatureCelsius: number;
  mood: string;
}

/**
 * Service to manage the tea menu. None of these affect brew outcomes.
 */
@Injectable()
export class MenuService {
  /**
   * Retrieves the comprehensive menu.
   *
   * @returns {TeaMenuItem[]} The array of teas.
   */
  getMenu(): TeaMenuItem[] {
    return [
      {
        name: 'Earl Grey',
        description: 'A classic. Will not brew.',
        steepTimeMinutes: 5,
        temperatureCelsius: 95,
        mood: 'Distinguished',
      },
      {
        name: 'Chamomile',
        description: 'Calming. Will not brew.',
        steepTimeMinutes: 5,
        temperatureCelsius: 100,
        mood: 'Sleepy',
      },
      {
        name: 'Oolong',
        description: 'Complex. Will not brew.',
        steepTimeMinutes: 3,
        temperatureCelsius: 90,
        mood: 'Thoughtful',
      },
      {
        name: 'Darjeeling',
        description: 'The champagne of teas. Will not brew.',
        steepTimeMinutes: 4,
        temperatureCelsius: 95,
        mood: 'Refined',
      },
      {
        name: 'Matcha',
        description: 'Powdered green tea. Will not brew.',
        steepTimeMinutes: 2,
        temperatureCelsius: 80,
        mood: 'Energetic',
      },
      {
        name: 'Rooibos',
        description: 'South African red bush. Will not brew.',
        steepTimeMinutes: 5,
        temperatureCelsius: 100,
        mood: 'Earthy',
      },
    ];
  }
}
