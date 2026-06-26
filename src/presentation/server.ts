import express, { Router } from 'express'

export class Server {

    private readonly app = express();

    constructor(private readonly port: number, private readonly routes: Router, private readonly callback?: (error?: Error | undefined) => void) { }

    start() {
        this.app.use(express.json())
        this.app.use(this.routes)
        this.app.listen(this.port, this.callback ? this.callback : () => {
            console.log(`Server running on port ${this.port}`)
        })
    }
}