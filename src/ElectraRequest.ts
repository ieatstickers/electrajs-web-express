import { Request } from "express";
import { ParsedQueryParam, ParsedQueryParams, RequestInterface } from "@electra/web";

export class ElectraRequest implements RequestInterface
{
  private readonly request: Request;
  
  public constructor(request: Request)
  {
    this.request = request;
  }
  
  public cookies(): {
    getAll(): { [key: string]: string };
    get(name: string): string;
    has(name: string): boolean;
  }
  {
    return {
      getAll: () => this.request.cookies,
      get: (name: string) => this.request.cookies[name],
      has: (name: string) => !!this.request.cookies[name],
    };
  }
  
  public routeParams(): {
    getAll(): Record<string, string>;
    get(name: string): string | null;
    has(name: string): boolean;
  }
  {
    return {
      getAll: () => this.request.params as Record<string, string>,
      get: (name: string) => this.request.params[name] || null,
      has: (name: string) => this.request.params[name] != null,
    };
  }
  
  public queryParams(): {
    getAll(): ParsedQueryParams;
    get(name: string): ParsedQueryParam | null;
    has(name: string): boolean;
  }
  {
    return {
      getAll: () => this.request.query as ParsedQueryParams,
      get: (name: string) => (this.request.query as ParsedQueryParams)[name] || null,
      has: (name: string) => !!this.request.query[name],
    };
  }
  
  public getBody(): any
  {
    return this.request.body;
  }
  
  public getHost(): string
  {
    return this.request.hostname;
  }
  
  public getHostname(): string
  {
    return this.request.hostname;
  }
  
  public getIp(): string | null
  {
    return this.request.ip || null;
  }
  
  public getPath(): string
  {
    return this.request.path;
  }
  
  public getProtocol(): string
  {
    return this.request.protocol;
  }
  
  public getHeader(name: string): string | null
  {
    return this.request.get(name) || null;
  }
  
  public isSecure(): boolean
  {
    return this.request.secure;
  }
  
  public get(key: string): any
  {
    const customValues = this.request["electra"] || {};
    return customValues[key];
  }
  
  public set(key: string, value: any): this
  {
    if (!this.request["electra"]) this.request["electra"] = {};
    this.request["electra"][key] = value;
    return this;
  }
}
