import express, { Router } from 'express'
import { GlobalErrorHandler } from './common/errors/error-handler';
import { Server as HttpServer } from 'http'
import cookieParser from 'cookie-parser';

export class Server {

    public readonly app = express();
    private serverListener?: HttpServer

    constructor(private readonly port: number, private readonly routes: Router, private readonly callback?: (error?: Error | undefined) => void) { }

    start() {
        this.app.use(cookieParser())
        this.app.use(express.json())
        this.app.use('/api', this.routes)
        this.app.use(GlobalErrorHandler.HandleError)
        this.serverListener = this.app.listen(this.port, this.callback ? this.callback : () => {
            console.log(`Server running on port ${this.port}`)
        })
    }

    close() {
        this.serverListener?.close();
    }
}