import { BusinessError } from "./business-error";
import { ErrorCode } from "./error-code";

class AuthenticationFailedError extends BusinessError {
    constructor() {
        super(ErrorCode.AUTHENTICATION_FAILED);
    }
}

export { AuthenticationFailedError };
