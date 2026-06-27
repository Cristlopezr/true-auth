import { NextFunction, Request, Response } from "express";
import { plainToInstance } from "class-transformer"
import { validate } from "class-validator";

export class DtoValidator {

    static validate = (dtoClass: any, propertyName: 'body' | 'query' | 'params') => {
        return async (req: Request, res: Response, next: NextFunction) => {
            const dtoInstance = plainToInstance(dtoClass, req[propertyName])
            const errors = await validate(dtoInstance);
            if (errors.length > 0) {
                const validationErrors = DtoValidator.formatErrors(errors)

                return res.status(400).json({ statusCode: 400, message: 'Bad Request', errors: validationErrors })
            }
            req[propertyName] = dtoInstance;
            next();
        }
    }

    private static formatErrors = (errors: any[]) => {
        const formattedErrors: Record<string, any> = {};

        errors.forEach((err) => {
            if (err.constraints) {
                formattedErrors[err.property] = Object.values(err.constraints);
            }
            if (err.children && err.children.length > 0) {
                formattedErrors[err.property] = DtoValidator.formatErrors(err.children);
            }
        });

        return formattedErrors;
    };
}