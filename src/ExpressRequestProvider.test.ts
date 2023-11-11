import { ExpressRequestProvider } from "./ExpressRequestProvider";
import { MockExpressRequest } from "./Mock/MockExpressRequest";

describe("ExpressRequestProvider", () => {
  
  let provider: ExpressRequestProvider;
  let mockRequest: MockExpressRequest;
  
  beforeEach(() => {
    mockRequest = new MockExpressRequest();
    provider = new ExpressRequestProvider(mockRequest as any);
  })
  
  afterEach(() => {
    jest.resetAllMocks();
  });
  
  describe("constructor", () => {
    it("sets the express request", () => {
      expect(provider['request']).toBe(mockRequest);
    });
  });
  
  describe("cookies", () => {
    
    describe("getAll", () => {
      it("returns all cookies", () => {
        expect(provider.cookies().getAll()).toBe(mockRequest.cookies);
      });
    });
    
    describe("get", () => {
      it("returns the cookie value", () => {
        expect(provider.cookies().get("exampleOne")).toBe(mockRequest.cookies.exampleOne);
      });
    });
    
    describe("has", () => {
      it("returns true if the cookie exists", () => {
        expect(provider.cookies().has("exampleOne")).toBe(true);
      });
      
      it("returns false if the cookie does not exist", () => {
        expect(provider.cookies().has("exampleThree")).toBe(false);
      });
    });
    
  });
  
  describe("routeParams", () => {
  
    describe("getAll", () => {
      it("returns all route params", () => {
        expect(provider.routeParams().getAll()).toBe(mockRequest.params);
      });
    });
    
    describe("get", () => {
      it("returns the route param value", () => {
        expect(provider.routeParams().get("exampleOne")).toBe(mockRequest.params.exampleOne);
      });
    });
    
    describe("has", () => {
      it("returns true if the route param exists", () => {
        expect(provider.routeParams().has("exampleOne")).toBe(true);
      });
      
      it("returns false if the route param does not exist", () => {
        expect(provider.routeParams().has("exampleThree")).toBe(false);
      });
    });
    
  });
  
  describe("queryParams", () => {
    
    describe("getAll", () => {
      it("returns all query params", () => {
        expect(provider.queryParams().getAll()).toBe(mockRequest.query);
      });
    });
    
    describe("get", () => {
      it("returns the query param value", () => {
        expect(provider.queryParams().get("exampleOne")).toBe(mockRequest.query.exampleOne);
      });
    });
    
    describe("has", () => {
      it("returns true if the query param exists", () => {
        expect(provider.queryParams().has("exampleOne")).toBe(true);
      });
      
      it("returns false if the query param does not exist", () => {
        expect(provider.queryParams().has("exampleThree")).toBe(false);
      });
    });
    
  });
  
  describe("getBody", () => {
    it("returns the request body", () => {
      expect(provider.getBody()).toBe(mockRequest.body);
    });
  });
  
  describe("getHost", () => {
    it("returns the request hostname", () => {
      expect(provider.getHost()).toBe(mockRequest.hostname);
    });
  });
  
  describe("getHostname", () => {
    it("returns the request hostname", () => {
      expect(provider.getHostname()).toBe(mockRequest.hostname);
    });
  });
  
  describe("getIp", () => {
    it("returns the request ip", () => {
      expect(provider.getIp()).toBe(mockRequest.ip);
    });
  });
  
  describe("getPath", () => {
    it("returns the request path", () => {
      expect(provider.getPath()).toBe(mockRequest.path);
    });
  });
  
  describe("getProtocol", () => {
    it("returns the request protocol", () => {
      expect(provider.getProtocol()).toBe(mockRequest.protocol);
    });
  });
  
  describe("getHeader", () => {
    it("returns the request header value", () => {
      expect(provider.getHeader("example")).toBe(mockRequest.get("example"));
    });
  });
  
  describe("isSecure", () => {
    it("returns the request secure value", () => {
      expect(provider.isSecure()).toBe(mockRequest.secure);
    });
  });
  
  describe("get & set work correctly", () => {
    it("get returns undefined if no custom values set", () => {
      expect(provider.get("test")).toBeUndefined();
    });
    
    it("set returns provider instance", () => {
      expect(provider.set("example", "value")).toBe(provider);
    });
    
    it("get returns the value set", () => {
      provider.set("example", "value");
      expect(provider.get("example")).toBe("value");
    });
  });
  
});
