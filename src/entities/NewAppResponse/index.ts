/**
 * Your new implementation.
 */
export function makeNewAppResponse(): NewAppResponse {
  return new NewAppResponse();
}

/**
 * For our demo example, this could be a completely different implementation of the AppResponse.
 * Of course, given more minor changes, the already existing pattern of using a kind of factory should
 * be able to cover more minor implementation changes.
 */
export class NewAppResponse {
  greet(): string {
    return 'Hey hey hey!';
  }
}
