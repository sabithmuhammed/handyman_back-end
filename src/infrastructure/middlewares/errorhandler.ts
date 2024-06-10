import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "../constants/httpStatusCodes";

export default function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    console.log(err);
    
    if (err.name === "UnauthorizedError") {
        res.status(STATUS_CODES.UNAUTHORIZED).json("Unauthorized");
        return;
    }
    if (err.name === "ValidationError") {
        res.status(STATUS_CODES.BAD_REQUEST).json("Validation Error",
        );
        return;
    }

    res.status(500).json("Internal Server Error");
}
