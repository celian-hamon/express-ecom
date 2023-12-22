import App from './app';
import AuthController from "./controllers/auth.controller";
import ItemController from "./controllers/item.controller";
import CategoryController from "./controllers/category.controller";
import orderController from "./controllers/order.controller";
import dotenv from 'dotenv';
import {PrismaClient} from "@prisma/client";

dotenv.config();
let prisma = new PrismaClient();
const app = new App(
    [
        new AuthController(prisma),
        new ItemController(prisma),
        new CategoryController(prisma),
        new orderController(prisma),
    ],
    parseInt(process.env.PORT as string, 10),
);

app.listen();