import { ErrorCode } from 'enum/ErrorCode'
import SystemError from './SystemError'

/**
 * custom Error object with http status codes
 * @param {statusCode} HTTP status code
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 * @param {code} self-defined error code
 */
export default class ClientError extends SystemError {
    statusCode: number | undefined
    constructor(statusCode: number, code: ErrorCode, message?: string) {
        super(code, message)
        this.name = this.constructor.name
        this.statusCode = statusCode
    }
}
