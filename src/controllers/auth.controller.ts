import * as express from 'express';
import {ControllerInterface} from "./controller.interface";
import {PrismaClient} from '@prisma/client'
import {authService} from "../services/auth.service";
import {AuthMiddleware} from "../middlewares/auth.middleware";

class UserController implements ControllerInterface {
    public path = '/auth';
    public router = express.Router();
    private prisma: PrismaClient;
    private service: authService;
    private middleware = new AuthMiddleware();

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
        this.service = new authService(this.prisma);
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get(this.path + "/users", this.middleware.checkTokenAdmin, this.list);
        this.router.get(this.path + "/:id", this.middleware.checkTokenAdmin, this.get);
        this.router.post(this.path + "/signin", this.signup);
        this.router.post(this.path + "/login", this.login);
        this.router.put(this.path + "/:id", this.middleware.checkToken, this.update);
        this.router.delete(this.path + "/:id", this.middleware.checkTokenAdmin, this.delete);
    }

    signup = async (req: express.Request, res: express.Response) => {
        let response = await this.service.signup(req);
        res.status(response.status).send(response);
    }

    login = async (req: express.Request, res: express.Response) => {
        let response = await this.service.login(req);
        res.status(response.status).send(response);
    }

    list = async (req: express.Request, res: express.Response) => {
        let response = await this.service.list(req);
        res.status(response.status).send(response);
    }

    get = async (req: express.Request, res: express.Response) => {
        let response = await this.service.get(req);
        res.status(response.status).send(response);
    }

    update = async (req: express.Request, res: express.Response) => {
        let response = await this.service.update(req);
        res.status(response.status).send(response);
    }

    delete = async (req: express.Request, res: express.Response) => {
        let response = await this.service.delete(req);
        res.status(response.status).send(response);
    }
}

export default UserController;