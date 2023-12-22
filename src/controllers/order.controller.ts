import {ControllerInterface} from "./controller.interface";
import * as express from "express";
import {categoryService} from "../services/category.service";
import {AuthMiddleware} from "../middlewares/auth.middleware";
import {orderService} from "../services/order.service";
import {PrismaClient} from "@prisma/client";

class OrderController implements ControllerInterface {
    public path = '/order';
    public router = express.Router();
    private service: orderService;
    private middleware = new AuthMiddleware();
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.intializeRoutes();
        this.prisma = prisma;
        this.service = new orderService(this.prisma);
    }

    public intializeRoutes() {
        this.router.get(this.path+"s", this.middleware.checkToken, this.list);
        this.router.get(this.path+"/:id", this.middleware.checkToken, this.get);
        this.router.post(this.path, this.middleware.checkToken, this.create);
        this.router.put(this.path+"/:id", this.middleware.checkTokenGestionnaire, this.update);
        this.router.delete(this.path+"/:id", this.middleware.checkTokenGestionnaire, this.delete);
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

export default OrderController;