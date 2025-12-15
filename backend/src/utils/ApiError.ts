class ApiError extends Error {
    public statusCode: number;
    public data: null | any;
    public success: boolean;
    public errors: any[];

    constructor(
        statusCode: number,
        message: string = "Something went wrong",
        errors: any[] = [],
        stack: string = ''
    ) {
        super(message);
        
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors; 
        this.data = null; 
        this.success = false;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };