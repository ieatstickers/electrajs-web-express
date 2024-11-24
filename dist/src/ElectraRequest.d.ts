import { Request } from "express";
import { ParsedQueryParam, ParsedQueryParams, RequestInterface } from "@electra/web";
export declare class ElectraRequest implements RequestInterface {
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
        getAll(): Record<string, string>;
        get(name: string): string | null;
        has(name: string): boolean;
    };
    queryParams(): {
        getAll(): ParsedQueryParams;
        get(name: string): ParsedQueryParam | null;
        has(name: string): boolean;
    };
    getBody(): any;
    getHost(): string;
    getHostname(): string;
    getIp(): string | null;
    getPath(): string;
    getProtocol(): string;
    getHeader(name: string): string | null;
    isSecure(): boolean;
    get(key: string): any;
    set(key: string, value: any): this;
}
