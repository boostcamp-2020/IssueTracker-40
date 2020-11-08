import { BusinessError } from "./business-error";
import { ErrorCode } from "./error-code";

class BadRequestError extends BusinessError {
    constructor() {
        super(ErrorCode.BAD_REQUEST);
    }
}

export { BadRequestError };
