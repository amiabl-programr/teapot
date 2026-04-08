import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Exception thrown when the teapot refuses to brew.
 */
export class TeapotException extends HttpException {
  /**
   * @param {string} teaRequested The type of tea that was requested
   */
  constructor(teaRequested: string) {
    super(
      {
        status: 'refused',
        message: 'I am a teapot. Coffee brewing requests are met with categorical rejection.',
        teaRequested,
        brewed: false,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.I_AM_A_TEAPOT,
    );
  }
}
