const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

const errorResponse = (res, message = 'Error', statusCode = 400, error = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error: error || message
    });
};

module.exports = {
    successResponse,
    errorResponse
};
