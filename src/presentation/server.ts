import express from 'express'

export class Server {

    private app = express();

    constructor(private readonly port: number, private readonly callback?: (error?: Error | undefined) => void) { }

    start() {
        this.app.listen(this.port, this.callback ? this.callback : () => {
            console.log(`Server running on port ${this.port}`)
        })
    }
}