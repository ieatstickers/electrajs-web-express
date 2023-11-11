import { PublicProperties } from "@electra/core";
import { ExpressWebAdaptor } from "./ExpressWebAdaptor";
import { AbstractEndpoint, Response } from "@electra/web";
import { MockExpressRequest } from "./Mock/MockExpressRequest";
import { MockExpressResponse } from "./Mock/MockExpressResponse";
import { AbstractPayload } from "@electra/core";

describe("ExpressWebAdaptor", () => {
  
  let adaptor: ExpressWebAdaptor;
  
  beforeEach(() => {
    adaptor = new ExpressWebAdaptor();
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  describe("middleware", () => {
    it("returns a function that calls the handler with the right arguments", () => {
      const handler = jest.fn();
      const middleware = adaptor.middleware(handler);
      expect(middleware.length).toBe(3);
      
      middleware({} as any, {} as any, {} as any);
      expect(handler).toHaveBeenCalledTimes(1);
    });
    
    it("returns a function that calls the handler with the right arguments when the handler has an error argument", () => {
      const handler = jest.fn();
      const middleware = adaptor.middleware((err: Error, req: any, res: any, next: any) => {
        handler(err, req, res, next);
      });
      expect(middleware.length).toBe(4);
      
      middleware(new Error("Something went wrong!"), {} as any, {} as any, () => {});
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });
  
  describe("route", () => {
    it("returns a function that calls the handler with the right arguments", () => {
      const handler = jest.fn();
      const route = adaptor.route((req, res) => {
        handler(req, res);
      });
      expect(route.length).toBe(2);
      
      route({} as any, {} as any, () => {});
      expect(handler).toHaveBeenCalledTimes(1);
    });
    
    it("returns a function that calls the handler with the right arguments when the handler has a next argument", () => {
      const handler = jest.fn();
      const route = adaptor.route((req: any, res: any, next: any) => {
        handler(req, res, next);
      });
      expect(route.length).toBe(3);
      
      route({} as any, {} as any, () => {});
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });
  
  describe("endpoint", () => {
    
    class TestPayload extends AbstractPayload
    {}
    
    it("returns a function that calls the handler with the right arguments", () => {

      class TestEndpoint extends AbstractEndpoint<TestPayload, any>
      {
        public getPayload(data: PublicProperties<any>): any
        {
          return new TestPayload();
        }

        public process(payload: TestPayload): any
        {
          return "test";
        }
      }

      const route = adaptor.endpoint(TestEndpoint);

      expect(route.length).toBe(3);

      const process = jest.spyOn(TestEndpoint.prototype, "process")

      route(new MockExpressRequest() as any, new MockExpressResponse() as any, () => {});
      expect(process).toHaveBeenCalledTimes(1);

    });

    it("calls response.send() if the endpoint returns a Response instance", async () => {

      const send = jest.spyOn(Response.prototype, "send");

      class TestEndpoint extends AbstractEndpoint<TestPayload, any>
      {
        public getPayload(data: PublicProperties<any>): any
        {
          return new TestPayload();
        }

        public process(payload: TestPayload): any
        {
          return this.response;
        }
      }

      const route = adaptor.endpoint(TestEndpoint);
      await route(new MockExpressRequest() as any, new MockExpressResponse() as any, () => {});
      expect(send).toHaveBeenCalledTimes(1);
    });

    it("calls response.json() if the endpoint returns an object", async () => {

      class JsonTestEndpoint extends AbstractEndpoint<TestPayload, any>
      {
        public getPayload(data: PublicProperties<any>): any
        {
          return new TestPayload();
        }

        public process(payload: TestPayload): any
        {
          return { test: "test" };
        }
      }

      const jsonMethod = jest.spyOn(Response.prototype, 'json');
      const route = adaptor.endpoint(JsonTestEndpoint);
      await route(new MockExpressRequest() as any, new MockExpressResponse() as any, () => {});
      expect(jsonMethod).toHaveBeenCalledTimes(1);
    });
    
    it("calls response.send() if the endpoint returns a string", async () => {
      
      class StringTestEndpoint extends AbstractEndpoint<TestPayload, any>
      {
        public getPayload(data: PublicProperties<any>): any
        {
          return new TestPayload();
        }
        
        public process(payload: TestPayload): any
        {
          return "test";
        }
      }
      
      const jsonMethod = jest.spyOn(Response.prototype, 'send');
      const route = adaptor.endpoint(StringTestEndpoint);
      await route(new MockExpressRequest() as any, new MockExpressResponse() as any, () => {});
      expect(jsonMethod).toHaveBeenCalledTimes(1);
    });
    
    it("calls next function is called with error if endpoint throws error", async () => {
      
      class ErrorTestEndpoint extends AbstractEndpoint<TestPayload, any>
      {
        public getPayload(data: PublicProperties<any>): any
        {
          return new TestPayload();
        }
        
        public process(payload: TestPayload): any
        {
          throw new Error("test");
        }
      }
      
      const next = jest.fn();
      const route = adaptor.endpoint(ErrorTestEndpoint);
      await route(new MockExpressRequest() as any, new MockExpressResponse() as any, next);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(new Error("test"));
    });
    
  });
  
});
