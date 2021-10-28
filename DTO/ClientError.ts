/**
 * custom Error object with http status codes
 * @param {statusCode} HTTP status code
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 * @param {code} self-defined error code
 */
export default class ClientError extends Error {
  statusCode: number | undefined;
  code: string | undefined;
  constructor(statusCode: number, code: string, message?: string) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
  }
}
