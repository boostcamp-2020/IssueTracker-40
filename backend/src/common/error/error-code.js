const ErrorCode = {
    ENTITY_NOT_FOUND: { code: 1000, httpStatusCode: 404, message: "Entity is not found" },
    ENTITY_ALREADY_EXIST: { code: 1001, httpStatusCode: 400, message: "Entity already exists" },
    AUTHENTICATION_FAILED: { code: 2001, httpStatusCode: 400, message: "Authentication is failed" }
};

export { ErrorCode };
