const errorHandler = (err, req, res, next) => {

    console.error("ERROR:", err);

    // =======================
    // Default Status
    // =======================

    let statusCode =
        err.statusCode || 500;

    let message =
        err.message ||
        "Internal Server Error";

    // =======================
    // Mongoose Validation Error
    // =======================

    if (
        err.name ===
        "ValidationError"
    ) {

        statusCode = 400;

        message =
            Object.values(
                err.errors
            )
                .map(
                    error =>
                        error.message
                )
                .join(", ");

    }

    // =======================
    // Invalid MongoDB ID
    // =======================

    if (
        err.name ===
        "CastError"
    ) {

        statusCode = 400;

        message =
            `Invalid ${err.path}.`;

    }

    // =======================
    // Duplicate MongoDB Entry
    // =======================

    if (
        err.code === 11000
    ) {

        statusCode = 409;

        const fields =
            Object.keys(
                err.keyValue || {}
            );

        message =
            `${fields.join(", ")} already exists.`;

    }

    // =======================
    // JWT Errors
    // =======================

    if (
        err.name ===
        "JsonWebTokenError"
    ) {

        statusCode = 401;

        message =
            "Invalid authentication token.";

    }

    if (
        err.name ===
        "TokenExpiredError"
    ) {

        statusCode = 401;

        message =
            "Authentication token has expired.";

    }

    // =======================
    // Response
    // =======================

    return res
        .status(statusCode)
        .json({

            success: false,

            message

        });

};

module.exports =
    errorHandler;