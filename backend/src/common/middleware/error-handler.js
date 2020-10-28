import { BusinessError } from "../error/business-error";

const errorHandler = (err, req, res, next) => {
    if (err instanceof BusinessError) {
        res.status(err.errorCode.httpStatusCode).json({
            error: {
                code: err.errorCode.code,
                message: err.errorCode.message
            }
        });
    }
};

export { errorHandler };
