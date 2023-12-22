import {PrismaClient} from "@prisma/client";
import express from "express";
import jwt from "jsonwebtoken";

export default class userHelper {
    public prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async getUserId(req: express.Request): Promise<number> {
        // @ts-ignore
        if (!req.headers.authorization) {
            return 0;
        }
        let token = req.headers.authorization.split(' ')[1];
        // @ts-ignore
        return jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err)
            } else {
                // @ts-ignore
                return decodedToken.id;
            }
        })
    }

    async isAdmin(req: express.Request): Promise<boolean> {
        // @ts-ignore
        if (!req.headers.authorization) {
            return false;
        }
        let token = req.headers.authorization.split(' ')[1];
        // @ts-ignore
        return jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err)
            } else {
                // @ts-ignore
                return decodedToken.role === 'ADMIN';
            }
        })
    }

    async isGestionnaire(req: express.Request): Promise<boolean> {
        // @ts-ignore
        if (!req.headers.authorization) {
            return false;
        }
        let token = req.headers.authorization.split(' ')[1];
        // @ts-ignore
        return jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err)
            } else {
                // @ts-ignore
                return decodedToken.role === 'GESTION' || decodedToken.role === 'ADMIN';
            }
        })
    }
}