import jwt from 'jsonwebtoken'
import express from "express";

export class AuthMiddleware {
    checkToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const token = req.headers.authorization && this.extractBearerToken(req.headers.authorization)

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        // @ts-ignore
        jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
            if (err) {
                res.status(401).json({ message: 'Unauthorized' })
            } else {
                return next()
            }
        })
    }

    checkTokenAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const token = req.headers.authorization && this.extractBearerToken(req.headers.authorization)

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        // @ts-ignore
        jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
            if (err) {
                res.status(401).json({ message: 'Unauthorized' })
            } else {
                // @ts-ignore
                if(decodedToken.isAdmin) {
                    return next()
                } else {
                    res.status(401).json({ message: 'Unauthorized' })
                }
            }
        })
    }

    extractBearerToken = (headerValue: any) => {
        if (typeof headerValue !== 'string') {
            return false
        }

        const matches = headerValue.match(/(bearer)\s+(\S+)/i)
        return matches && matches[2]
    }
}