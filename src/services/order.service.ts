import {PrismaClient} from '@prisma/client';
import express from "express";
import multer from 'multer';
import userHelper from "../helper/user.helper";

const upload = multer({dest: 'uploads/'})

export class orderService {
    private prisma: PrismaClient;
    private userHelper: userHelper;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
        this.userHelper = new userHelper(this.prisma);
    }

    async list(req: express.Request): Promise<any> {
        if (await this.userHelper.isAdmin(req)) {
            return {status: 200, message: await this.prisma.order.findMany(
                    {
                        include:{
                            items: true
                        }
                    }
                )};
        }
        return {status: 200, message: await this.prisma.order.findMany(
                {
                    where: {
                        userId: await this.userHelper.getUserId(req)
                    },
                    include:{
                        items: true
                    }
                }
            )};
    }

    async get(req: express.Request): Promise<any> {
        return await this.prisma.order.findUnique({
            where: {
                userId: await this.userHelper.getUserId(req),
                id: parseInt(req.params.id)
            },
            include: {
                items: true
            }
        }).then((item) => {
            if (item === null) {
                return {status: 404, message: "Not Found"};
            }
            return {status: 201, message: item};
        }).catch(
            (err) => {
                return {status: 404, message: "Not Found"};
            }
        );
    }

    async create(req: express.Request): Promise<any> {
        const userId = await this.userHelper.getUserId(req);

        let objects = [];
        for (const item of req.body.items) {
            let object = await this.prisma.item.findUnique({
                where: {
                    id: parseInt(item.id.toString())
                }
            }).then((object) => {
                // @ts-ignore
                if (object?.quantity < item.quantity) {
                    return {status: 422, message: "Not enough quantity available"};
                } else {
                    return this.prisma.orderItem.create({
                        data: {
                            quantity: item.quantity,
                            item: {
                                connect: {
                                    id: parseInt(item.id.toString())
                                }
                            }
                        }
                    }).then(async (item) => {
                        return await this.prisma.item.update({
                            where: {
                                id: parseInt(item.itemId.toString())
                            },
                            data: {
                                quantity: object?.quantity - item.quantity
                            }
                        }).then(object => {
                                return {status: 201, message: item}
                            }
                        ).catch((err) => {
                            return {status: 422, message: err.message.split('\n').slice(-1)[0]};
                        });
                        return {status: 201, message: item};
                    }).catch((err) => {
                        return {status: 422, message: err.message.split('\n').slice(-1)[0]};
                    });
                }
            }).catch((err) => {
                return {status: 422, message: err.message.split('\n').slice(-1)[0]};
            });
            if (object.status !== 201) {
                return object;
            } else {
                objects.push(object.message);
            }
        }
        return await this.prisma.order.create(
            {
                data: {
                    user: {
                        connect: {
                            id: userId
                        }
                    },
                    status: "PENDING",
                    items: {
                        connect: objects.map((object) => {
                            return {id: object.id}
                        })
                    },
                },
                include: {
                    items: true
                }
            }
        ).then(
            (item) => {
                return {status: 201, message: item};
            }
        ).catch((err) => {
            console.log(err);
            return {status: 422, message: err.message.split('\n').slice(-1)[0]};
        });
    }

    async update(req: express.Request): Promise<any> {
        const userId = await this.userHelper.getUserId(req);
        let orders = this.prisma.order.findMany(
            {
                where: {
                    userId: userId
                }
            }
        )
        if (orders === undefined) {
            return {status: 404, message: "Not Found"};
        } else {
            return await this.prisma.order.update({
                where: {
                    id: parseInt(req.params.id)
                },
                data: {
                    status: req.body.status
                },
                include: {
                    items: true
                }
            }).then(
                (item) => {
                    return {status: 200, message: item};
                }
            ).catch((err) => {
                console.log(err)
                return {status: 422, message: err.message.split('\n').slice(-1)[0]};
            });
        }
    }

    async delete(req: express.Request): Promise<any> {
        return await this.prisma.order.delete({
            where: {
                id: parseInt(req.params.id)
            },
            include: {
                items: true
            }
        }).then(
            (item) => {
                return {status: 204};
            }
        ).catch((err) => {
            console.log(err)
            return {status: 404, message: "Not Found"};
        });
    }
}