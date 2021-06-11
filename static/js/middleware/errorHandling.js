module.exports.catchAsync = funct => {
    return (req, res, next) => {
        console.log('Catch Async Working');
        funct(req, res, next).catch(next);
    }
}

module.exports.ExpressError = class ExpressError extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}
