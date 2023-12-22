import {ControllerInterface} from "./controller.interface";
import * as express from "express";
import {categoryService} from "../services/category.service";
import {AuthMiddleware} from "../middlewares/auth.middleware";
import {PrismaClient} from "@prisma/client";

class CategoryController implements ControllerInterface {
    public path = '/category';
    public router = express.Router();
    private middleware = new AuthMiddleware();
    private prisma: PrismaClient;
    private service: categoryService;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
        this.service = new categoryService(this.prisma);
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get("/categories", this.list);
        this.router.get(this.path + "/:id", this.get);
        this.router.post(this.path, this.middleware.checkTokenAdmin, this.create);
        this.router.put(this.path + "/:id", this.middleware.checkTokenAdmin, this.update);
        this.router.delete(this.path + "/:id", this.middleware.checkTokenAdmin, this.delete);
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

export default CategoryController;