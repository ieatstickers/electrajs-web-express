
import { Response } from "express";
import { ResponseHeaders, ResponseInterface } from "@electra/web";

export class ElectraResponse implements ResponseInterface
{
  private readonly response: Response;
  
  public constructor(response: Response)
  {
    this.response = response;
  }
  
  public headers(): ResponseHeaders
  {
    const responseHeaders: ResponseHeaders = {
      get: (name: string) => {
        return this.response.get(name)
      },
      set: (name: string, value: string) => {
        this.response.set(name, value);
        return responseHeaders;
      }
    };
    return responseHeaders;
  }
  
  public setCookie(
    name: string,
    value: string,
    options?: {
      domain?: string; // default: domain name of the app
      encode?: (value: string) => string; // default: encodeURIComponent
      expires?: Date; // default: session cookie
      httpOnly?: boolean;
      maxAge?: number;
      path?: string; // default: "/"
      secure?: boolean;
      sameSite?: "strict" | "lax" | "none";
    }
  ): void
  {
    this.response.cookie(name, value, options);
  }
  
  public download(
    filepath: string,
    options?: {
      filename?: string; // default: file name from filepath
      maxAge?: number; // Defaults to 0
      headers?: { [key: string]: string };
      cacheControl?: boolean; // default: true
    }
  ): Promise<void>
  {
    return new Promise((resolve, reject) => {
      const filename = options?.filename;
      delete options?.filename;
      
      this.response.download(
        filepath,
        filename,
        options || {},
        (error: Error) => error ? reject(error) : resolve()
      );
    });
  }
  
  public end(): void
  {
    this.response.end();
  }
  
  public json(data: any): void
  {
    this.response.json(data);
  }
  
  public redirect(urlOrStatusCode: string | number, url?: string): void
  {
    if (typeof urlOrStatusCode === "number" && typeof url === "string")
    {
      this.response.redirect(urlOrStatusCode, url);
    }
    else if (typeof urlOrStatusCode === "string" && typeof url === "undefined")
    {
      this.response.redirect(urlOrStatusCode);
    }
    else
    {
      throw new Error("Invalid redirect parameters");
    }
  }
  
  public send(body?: any): void
  {
    this.response.send(body);
  }
  
  public sendFile(
    filepath: string,
    options?: {
      maxAge?: number, // default: 0
      lastModifiedEnabled?: boolean, // default: true
      headers?: { [key: string]: string },
      cacheControl?: boolean, // default: true
    }
  ): void
  {
    this.response.sendFile(filepath, options);
  }
  
  public setStatus(statusCode: number): this
  {
    this.response.status(statusCode);
    return this;
  }
  
}
