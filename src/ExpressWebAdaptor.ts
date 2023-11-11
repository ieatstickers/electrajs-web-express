import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction as ExpressNextFunction,
  RequestHandler as ExpressRequestHandler
} from "express";
import { AbstractEndpoint, Request, RequestInterface, Response, ResponseInterface } from "@electra/web";
import { ExpressRequestProvider } from "./ExpressRequestProvider";
import { ExpressResponseProvider } from "./ExpressResponseProvider";
import { NextFunction } from "./Type/NextFunction";

export class ExpressWebAdaptor
{
  public middleware(
    handler: (req: RequestInterface, res: ResponseInterface, next: NextFunction) => void
  ): (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => void;
  
  public middleware(
    handler: (err: Error, req: RequestInterface, res: ResponseInterface, next: NextFunction) => void
  ): (err: Error, req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => void;
  
  public middleware(handler: (...args: Array<any>) => void): (...args: Array<any>) => void
  {
    if (handler.length === 4)
    {
      return (err: Error, req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
        return handler(err, new Request(new ExpressRequestProvider(req)), new Response(new ExpressResponseProvider(res)), next);
      }
    }
    
    return (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
      return handler(new Request(new ExpressRequestProvider(req)), new Response(new ExpressResponseProvider(res)), next);
    }
  }
  
  public route(
    handler: (req: RequestInterface, res: ResponseInterface) => void
  ): ExpressRequestHandler;
  
  public route(
    handler: (req: RequestInterface, res: ResponseInterface, next: NextFunction) => void
  ): ExpressRequestHandler;
  
  public route(handler: (...args: any[]) => void): ExpressRequestHandler
  {
    if (handler.length === 3)
    {
      return (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
        handler(new Request(new ExpressRequestProvider(req)), new Response(new ExpressResponseProvider(res)), next);
      };
    }
    
    return (req: ExpressRequest, res: ExpressResponse) => {
      handler(new Request(new ExpressRequestProvider(req)), new Response(new ExpressResponseProvider(res)));
    };
  }
  
  public endpoint<EndpointClass extends new (payload: { [name: string]: any }, request: RequestInterface, response: ResponseInterface) => AbstractEndpoint<any, any>>(endpoint: EndpointClass): ExpressRequestHandler
  {
    return this.route(async (req: RequestInterface, res: ResponseInterface, next: NextFunction) => {
      
      try {
        const endpointInstance = new endpoint(
          Object.assign(
            {},
            req.routeParams().getAll(),
            req.queryParams().getAll(),
            req.getBody()
          ),
          req,
          res
        );
        const response = await endpointInstance.execute();
        
        if (response instanceof Response)
        {
          return response.send();
        }
        else if (response != null && (typeof response === "object" || Array.isArray(response)))
        {
          return res.json(response);
        }
        
        return res.send(response);
      }
      catch (error) {
        next(error);
      }
    });
  }
}

