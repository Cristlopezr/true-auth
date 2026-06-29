import express, { Router } from 'express'
import { GlobalErrorHandler } from './common/errors/error-handler';
import cookieParser from 'cookie-parser';

export class Server {

    private readonly app = express();

    constructor(private readonly port: number, private readonly routes: Router, private readonly callback?: (error?: Error | undefined) => void) { }

    start() {
        this.app.use(cookieParser())
        this.app.use(express.json())
        this.app.use('/api', this.routes)
        this.app.use(GlobalErrorHandler.HandleError)
        this.app.listen(this.port, this.callback ? this.callback : () => {
            console.log(`Server running on port ${this.port}`)
        })
    }
}