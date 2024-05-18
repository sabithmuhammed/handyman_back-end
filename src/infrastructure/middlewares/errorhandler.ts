import { Request, Response, NextFunction } from "express";

export default function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    console.log(err);
    
    if (err.name === "UnauthorizedError") {
        res.status(401).json("Unauthorized");
        return;
    }
    if (err.name === "ValidationError") {
        res.status(400).json("Validation Error",
        );
        return;
    }

    res.status(500).json("Internal Server Error");
}
