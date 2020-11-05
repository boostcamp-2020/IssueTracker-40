import { BusinessError } from "./business-error";
import { ErrorCode } from "./error-code";

class UnauthorizedError extends BusinessError {
    constructor() {
        super(ErrorCode.UNAUTHORIZED);
    }
}

export { UnauthorizedError };
