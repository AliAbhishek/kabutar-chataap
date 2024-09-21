export const errorRes = (res, status, message, data = null) => {
    res.status(status).json({
        success: false,
        status,
        message,
        data,
    });
};


export const successRes = (res, status, message, data = null) => {
    res.status(status).json({
        success: true,
        status,
        message,
        data,
    });
};


