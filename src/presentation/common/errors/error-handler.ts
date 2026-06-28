import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../../domain/common/custom-error";

export class GlobalErrorHandler {
    static HandleError = (error: any, req: Request, res: Response, next: NextFunction) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({
                code: error.statusCode,
                message: error.message
            })
        }
        console.error(`Unexpected error: `, error)
        return res.status(500).json({ code: 500, message: "Internal server error" })
    }
}