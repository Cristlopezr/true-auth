import { Response } from "express";
import { CustomError } from "../../../domain/common/custom-error";

export class ErrorHandler {
    static HandleError = (res: Response, error: any) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({
                code: error.statusCode,
                message: error.message
            })
        }
        return res.status(500).json({ code: 500, message: "Internal server error" })
    }
}