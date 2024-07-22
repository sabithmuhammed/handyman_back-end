"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
function errorHandler(err, req, res, next) {
    console.log(err);
    if (err.name === "UnauthorizedError") {
        res.status(httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED).json("Unauthorized");
        return;
    }
    if (err.name === "ValidationError") {
        res.status(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST).json("Validation Error");
        return;
    }
    res.status(500).json("Internal Server Error");
}
exports.default = errorHandler;
//# sourceMappingURL=errorhandler.js.map