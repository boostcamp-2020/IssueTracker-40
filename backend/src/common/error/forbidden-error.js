import { BusinessError } from "./business-error";
import { ErrorCode } from "./error-code";

class ForbiddenError extends BusinessError {
    constructor() {
        super(ErrorCode.FORBIDDEN);
    }
}

export { ForbiddenError };
