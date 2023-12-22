import express from "express";

export interface ControllerInterface {
    path: string;
    router: express.Router;
    intializeRoutes(): void;
}