import { Request, Response, NextFunction } from "express";

export default function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (err.name === "UnauthorizedError") {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    if (err.name === "ValidationError") {
        res.status(400).json({
            error: "Validation Error",
        });
        return;
    }

    res.status(500).json({ error: "Internal Server Error" });
}
