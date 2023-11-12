import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction as ExpressNextFunction,
  RequestHandler as ExpressRequestHandler
} from "express";
import { AbstractEndpoint, RequestInterface, ResponseInterface } from "@electra/web";
import { ElectraRequest } from "./ElectraRequest";
import { ElectraResponse } from "./ElectraResponse";
import { NextFunction } from "./Type/NextFunction";

export class Adaptor
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
        return handler(err, new ElectraRequest(req), new ElectraResponse(res), next);
      }
    }
    
    return (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
      return handler(new ElectraRequest(req), new ElectraResponse(res), next);
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
        handler(new ElectraRequest(req), new ElectraResponse(res), next);
      };
    }
    
    return (req: ExpressRequest, res: ExpressResponse) => {
      handler(new ElectraRequest(req), new ElectraResponse(res));
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
        
        if (response instanceof ElectraResponse)
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

