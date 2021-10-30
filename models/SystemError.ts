import { ErrorCode } from 'enum/ErrorCode'

/**
 * @param {code} self-defined error code
 */
export default class SystemError extends Error {
    code: string | undefined
    constructor(code: ErrorCode, message?: string) {
        super(message)
        this.name = this.constructor.name
        this.code = code
    }
}
