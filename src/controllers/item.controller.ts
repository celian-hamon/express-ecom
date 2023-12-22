import * as express from 'express';
import {ControllerInterface} from "./controller.interface";
import {PrismaClient} from '@prisma/client'
import {itemService} from "../services/item.service";
import {AuthMiddleware} from "../middlewares/auth.middleware";

class ItemController implements ControllerInterface {
    public path = '/item';
    public router = express.Router();
    private middleware = new AuthMiddleware();
    private prisma: PrismaClient;
    private service: itemService;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
        this.service = new itemService(this.prisma);
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get(this.path + "s", this.list);
        this.router.get(this.path + "/:id", this.get);
        this.router.post(this.path, this.middleware.checkTokenGestionnaire, this.create);
        this.router.put(this.path + "/:id", this.middleware.checkTokenGestionnaire, this.update);
        this.router.delete(this.path + "/:id", this.middleware.checkTokenGestionnaire, this.delete);
    }

    list = async (req: express.Request, res: express.Response) => {
        let response = await this.service.list(req);
        res.send(response);
    }

    get = async (req: express.Request, res: express.Response) => {
        let response = await this.service.get(req);
        res.send(response);
    }

    create = async (req: express.Request, res: express.Response) => {
        let response = await this.service.create(req);
        res.send(response);
    }

    update = async (req: express.Request, res: express.Response) => {
        let response = await this.service.update(req);
        res.send(response);
    }

    delete = async (req: express.Request, res: express.Response) => {
        let response = await this.service.delete(req);
        res.send(response);
    }
}

export default ItemController;