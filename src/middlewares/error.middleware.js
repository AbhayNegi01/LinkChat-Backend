import ApiError from "../utils/apiError.js"

const errorHandler = (err, req, res, next) => {
    if(err instanceof ApiError) {
        return res.status(err.statusCode)
        .json({
            success: err.success,
            message: err.message,
            errors: err.errors,
            data: null,
            stack: err.stack,
        })
    }

    const statusCode = err.statusCode || 500;
    return res.status(statusCode)
    .json({
        success: false,
        message: err.message || "Internal Server Error",
        stack: err.stack,
    })
}

export default errorHandler