import {PrismaClient} from '@prisma/client';
import express from "express";
import multer from 'multer';

const upload = multer({dest: 'uploads/'})

export class itemService {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async list(req: express.Request): Promise<any> {
        return {status: 200, message: this.prisma.item.findMany()};
    }

    async get(req: express.Request): Promise<any> {
        return {
            status: 200, message: this.prisma.item.findUnique({
                where: {
                    id: parseInt(req.params.id)
                }
            })
        };
    }

    async create(req: express.Request): Promise<any> {
        return this.prisma.item.create(
            {
                data: {
                    name: req.body.name,
                    description: req.body.description,
                    price: parseFloat(req.body.price),
                    // @ts-ignore
                    imageUrl: req.body.image,
                    quantity: parseInt(req.body.quantity),
                    categories: {
                        connect: req.body.categories?.map((id: string) => {
                            return {id: parseInt(id)}
                        })
                    }
                }
            }
        ).then(
            (item) => {
                return {status: 201, message: item};
            }
        ).catch((err) => {
            return {status: 422, message: err.message.split('\n').slice(-1)[0]};
        });
    }

    async update(req: express.Request): Promise<any> {
        return this.prisma.item.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                imageUrl: req.body.image,
                quantity: parseInt(req.body.quantity),
                categories: {
                    connect: req.body.categories?.map((id: string) => {
                        return {id: parseInt(id)}
                    })
                }
            }
        }).then(
            (item) => {
                return {status: 200, message: item};
            }
        ).catch((err) => {
            if (err.code === 'P2016') {
                return {status: 404, message: "Not Found"}
            }
            return {status: 422, message: err.message.split('\n').slice(-1)[0]};
        });
    }

    async delete(req: express.Request): Promise<any> {
        return this.prisma.item.delete({
            where: {
                id: parseInt(req.params.id)
            }
        }).then(
            (item) => {
                return {status: 204};
            }
        ).catch((err) => {
            return {status: 404, message: "Not Found"};
        });
    }
}