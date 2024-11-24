import { Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNextFunction, RequestHandler as ExpressRequestHandler } from "express";
import { AbstractEndpoint, RequestInterface, ResponseInterface } from "@electra/web";
import { NextFunction } from "./Type/NextFunction";
export declare class Adaptor {
    middleware(handler: (req: RequestInterface, res: ResponseInterface, next: NextFunction) => void): (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => void;
    middleware(handler: (err: Error, req: RequestInterface, res: ResponseInterface, next: NextFunction) => void): (err: Error, req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => void;
    route(handler: (req: RequestInterface, res: ResponseInterface) => void): ExpressRequestHandler;
    route(handler: (req: RequestInterface, res: ResponseInterface, next: NextFunction) => void): ExpressRequestHandler;
    endpoint<EndpointClass extends new (payload: any, request: RequestInterface, response: ResponseInterface) => AbstractEndpoint<any, any>>(endpoint: EndpointClass): ExpressRequestHandler;
}
