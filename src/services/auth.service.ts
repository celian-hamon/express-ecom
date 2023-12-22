import {PrismaClient} from '@prisma/client';
import express from "express";
import jwt from 'jsonwebtoken';
import userHelper from "../helper/user.helper";

export class authService {
    private prisma: PrismaClient;
    private userHelper: userHelper;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
        this.userHelper = new userHelper(this.prisma);
    }

    async signup(req: express.Request): Promise<any> {
        if (req.body.password.length < 8) {
            return {status: 400, message: "Passwords is too short"};
        }
        //mail regex
        if (!req.body.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return {status: 400, message: "Email is not valid"};
        }
        return await this.prisma.user.create({
            data: {
                email: req.body.email,
                password: this.getHash(req.body.password),
                firstName: req.body.firstName,
                lastName: req.body.lastName,
            }
        }).then(
            (user) => {
                return {status: 201, message: user};
            }
        ).catch((err) => {
            if (err.code === "P2002") {
                return {status: 400, message: "Email already exists"};
            } else {
                return {status: 500, message: "Internal Server Error"};
            }
        });
    }

    async login(req: express.Request): Promise<any> {
        let user = await this.prisma.user.findUnique({
            where: {
                email: req.body.email
            }
        });

        if (user && this.compareHash(req.body.password, user.password)) {
            const token = jwt.sign({
                id: user.id,
                email: user.email,
                role: user.role,
                // @ts-ignore
            }, process.env.SECRET, { expiresIn: '3 hours' })
            return {status: 200, message: token};
        } else {
            return {status: 401, message: "Unauthorized"};
        }


    }

    async list(req: express.Request): Promise<any> {
        return {status: 200, message: await this.prisma.user.findMany()};
    }

    async get(req: express.Request): Promise<any> {
        return await this.prisma.user.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        }).then((item) => {
            return {status: 200, message: item};
        }).catch(
            (err) => {
                return {status: 404, message: "Not Found"};
            }
        );
    }

    async update(req: express.Request): Promise<any> {
        const userId = await this.userHelper.getUserId(req);
        let user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (user?.role !== "ADMIN" && userId != parseInt(req.params.id)) {
            return {status: 401, message: "Unauthorized"};
        } else {
            return await this.prisma.user.update({
                where: {
                    id: parseInt(req.params.id)
                },
                data: {
                    email: req.body.email,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    role: user?.role === "ADMIN" ? req.body.role : user?.role
                }
            }).then(
                (item) => {
                    return {status: 200, message: item};
                }
            ).catch((err) => {
                console.log(err)
                return {status: 422, message: "Unprocessable Entity"};
            });
        }
    }

    async delete(req: express.Request): Promise<any> {
        const userId = await this.userHelper.getUserId(req);
        let user = await this.prisma.user.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        if (userId === 0 || user === null || user?.role === "ADMIN") {
            return {status: 401, message: "Unauthorized"};
        } else {
            return await this.prisma.user.delete({
                where: {
                    id: parseInt(req.params.id)
                }
            }).then(
                (item) => {
                    return {status: 200, message: item};
                }
            ).catch((err) => {
                console.log(err)
                return {status: 422, message: "Unprocessable Entity"};
            });
        }
    }

    private getHash(password: string) {
        let bcrypt = require('bcryptjs');
        return bcrypt.hashSync(password, 8);
    }

    private compareHash(password: string, hash: string) {
        let bcrypt = require('bcryptjs');
        return bcrypt.compareSync(password, hash);
    }
}