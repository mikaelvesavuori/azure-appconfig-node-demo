/**
 * The original, existing implementation.
 */
export function makeAppResponse(): AppResponse {
  return new AppResponse();
}

/**
 * Description.
 */
export class AppResponse {
  respond(): string {
    return 'Hello User!';
  }
}
