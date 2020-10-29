class BusinessError extends Error {
    constructor(errorCode) {
        super(errorCode.message);
        this.errorCode = errorCode;
    }
}

export { BusinessError };
