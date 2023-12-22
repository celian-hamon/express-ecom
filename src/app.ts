import express from 'express';
import * as bodyParser from 'body-parser';
import cors from "cors";
import helmet from "helmet";
import {PrismaClient} from "@prisma/client";

class App {
    public app: express.Application;
    public port: number;

    constructor(controllers: any, port: number) {
        this.app = express();
        this.port = port;

        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(helmet());
        this.app.use(cors());
    }

    private initializeControllers(controllers: any[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });

        // since its last route matched it will return 404
        this.app.use((req, res) => res.json({
            status: 404,
            message: "Not Found"
        }));
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}

export default App;