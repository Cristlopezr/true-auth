import { NextFunction, Request, Response } from "express";
import { plainToInstance } from "class-transformer"
import { validate } from "class-validator";

export class DtoValidator {

    static validate = (dtoClass: any, propertyName: 'body' | 'query' | 'params') => {
        return async (req: Request, res: Response, next: NextFunction) => {
            const dtoInstance = plainToInstance(dtoClass, req[propertyName])
            const errors = await validate(dtoInstance);

            if (errors.length > 0) {
                return res.status(400).json({ errors })
            }
            req[propertyName] = dtoInstance;
            next();
        }
    }
}