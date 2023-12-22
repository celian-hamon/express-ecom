import {PrismaClient} from '@prisma/client';
import express from "express";
import multer from 'multer';

const upload = multer({dest: 'uploads/'})

export class categoryService {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async list(req: express.Request): Promise<any> {
        return {status: 200, message: await this.prisma.category.findMany()};
    }

    async get(req: express.Request): Promise<any> {
        return await this.prisma.category.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        }).then((item) => {
            return {status: 201, message: item};
        }).catch(
            (err) => {
                return {status: 404, message: "Not Found"};
            }
        );
    }

    async create(req: express.Request): Promise<any> {
        return await this.prisma.category.create(
            {
                data: {
                    name: req.body.name,
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
        return await this.prisma.category.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                name: req.body.name,
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

    async delete(req: express.Request): Promise<any> {
        return await this.prisma.category.delete({
            where: {
                id: parseInt(req.params.id)
            }
        }).then(
            (item) => {
                return {status: 200, message: item};
            }
        ).catch((err) => {
            console.log(err)
            return {status: 404, message: "Not Found"};
        });
    }
}