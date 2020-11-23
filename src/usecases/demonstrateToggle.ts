import { makeAppResponse } from '../entities/AppResponse';
import { makeNewAppResponse } from '../entities/NewAppResponse';

import { AppResponse } from '../contracts/AppResponse';
import { NewAppResponse } from '../contracts/NewAppResponse';
import { Toggle } from '../contracts/Toggle';

/**
 * Since this simple demo follows Clean Architecture, our app can be easily extended from the use case,
 * instead of re-inventing yet another abstraction point later.
 *
 * @param toggle Processed Toggle object
 */
export function demonstrateToggleUseCase(toggle?: Toggle): AppResponse | NewAppResponse {
  try {
    // New implementation for developers and User Acceptance Testing people
    // We will match for the correct ID, check that it's enabled and that we have a sufficiently privileged user group

    if (toggle && toggle.isActiveForCurrentUser) {
      const response = makeNewAppResponse();
      return { text: response.greet() } as NewAppResponse;
    }
    // Original, existing implementation
    else {
      const response = makeAppResponse();
      return { response: response.respond() } as AppResponse;
    }
  } catch (error) {
    throw new Error(error);
  }
}
