import { Request } from "express";
import { ParsedQueryParam, ParsedQueryParams, RequestInterface } from "@electra/web";
export declare class ExpressRequestProvider implements RequestInterface {
    private readonly request;
    constructor(request: Request);
    cookies(): {
        getAll(): {
            [key: string]: string;
        };
        get(name: string): string;
        has(name: string): boolean;
    };
    routeParams(): {
        getAll(): {
            [key: string]: string;
        };
        get(name: string): string;
        has(name: string): boolean;
    };
    queryParams(): {
        getAll(): ParsedQueryParams;
        get(name: string): ParsedQueryParam;
        has(name: string): boolean;
    };
    getBody(): {
        [key: string]: string | number | boolean;
    };
    getHost(): string;
    getHostname(): string;
    getIp(): string;
    getPath(): string;
    getProtocol(): string;
    getHeader(name: string): string;
    isSecure(): boolean;
    get(key: string): any;
    set(key: string, value: any): this;
}
