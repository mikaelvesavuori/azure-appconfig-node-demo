import { Context, HttpRequest } from '@azure/functions';

import { demonstrateToggleUseCase } from '../usecases/demonstrateToggle';

import { getToggle } from '../frameworks/getToggle';

/**
 * @description The controller is where the serverless application "starts".
 *
 * @param {Object} context - Context object
 * @param {Object} req - Incoming HTTP request
 */
export async function toggleDemo(context: Context, req: HttpRequest): Promise<any> {
  if (!context || !req) throw new Error('Missing context and/or req!');

  /**
   * We will use a header called "group" to know our user type.
   * This could be done in any number of other ways, with cookies, caller URL parsing, OAuth/login tokens...
   */
  const appConfigToggles = await getToggle(req.headers.group);
  console.log('TOGGLES', appConfigToggles);

  return {
    body: demonstrateToggleUseCase(appConfigToggles)
  };
}
