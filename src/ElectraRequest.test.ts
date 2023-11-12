import { ElectraRequest } from "./ElectraRequest";
import { MockExpressRequest } from "./Mock/MockExpressRequest";

describe("ElectraRequest", () => {
  
  let electraRequest: ElectraRequest;
  let mockExpressRequest: MockExpressRequest;
  
  beforeEach(() => {
    mockExpressRequest = new MockExpressRequest();
    electraRequest = new ElectraRequest(mockExpressRequest as any);
  })
  
  afterEach(() => {
    jest.resetAllMocks();
  });
  
  describe("constructor", () => {
    it("sets the express request", () => {
      expect(electraRequest['request']).toBe(mockExpressRequest);
    });
  });
  
  describe("cookies", () => {
    
    describe("getAll", () => {
      it("returns all cookies", () => {
        expect(electraRequest.cookies().getAll()).toBe(mockExpressRequest.cookies);
      });
    });
    
    describe("get", () => {
      it("returns the cookie value", () => {
        expect(electraRequest.cookies().get("exampleOne")).toBe(mockExpressRequest.cookies.exampleOne);
      });
    });
    
    describe("has", () => {
      it("returns true if the cookie exists", () => {
        expect(electraRequest.cookies().has("exampleOne")).toBe(true);
      });
      
      it("returns false if the cookie does not exist", () => {
        expect(electraRequest.cookies().has("exampleThree")).toBe(false);
      });
    });
    
  });
  
  describe("routeParams", () => {
  
    describe("getAll", () => {
      it("returns all route params", () => {
        expect(electraRequest.routeParams().getAll()).toBe(mockExpressRequest.params);
      });
    });
    
    describe("get", () => {
      it("returns the route param value", () => {
        expect(electraRequest.routeParams().get("exampleOne")).toBe(mockExpressRequest.params.exampleOne);
      });
    });
    
    describe("has", () => {
      it("returns true if the route param exists", () => {
        expect(electraRequest.routeParams().has("exampleOne")).toBe(true);
      });
      
      it("returns false if the route param does not exist", () => {
        expect(electraRequest.routeParams().has("exampleThree")).toBe(false);
      });
    });
    
  });
  
  describe("queryParams", () => {
    
    describe("getAll", () => {
      it("returns all query params", () => {
        expect(electraRequest.queryParams().getAll()).toBe(mockExpressRequest.query);
      });
    });
    
    describe("get", () => {
      it("returns the query param value", () => {
        expect(electraRequest.queryParams().get("exampleOne")).toBe(mockExpressRequest.query.exampleOne);
      });
    });
    
    describe("has", () => {
      it("returns true if the query param exists", () => {
        expect(electraRequest.queryParams().has("exampleOne")).toBe(true);
      });
      
      it("returns false if the query param does not exist", () => {
        expect(electraRequest.queryParams().has("exampleThree")).toBe(false);
      });
    });
    
  });
  
  describe("getBody", () => {
    it("returns the request body", () => {
      expect(electraRequest.getBody()).toBe(mockExpressRequest.body);
    });
  });
  
  describe("getHost", () => {
    it("returns the request hostname", () => {
      expect(electraRequest.getHost()).toBe(mockExpressRequest.hostname);
    });
  });
  
  describe("getHostname", () => {
    it("returns the request hostname", () => {
      expect(electraRequest.getHostname()).toBe(mockExpressRequest.hostname);
    });
  });
  
  describe("getIp", () => {
    it("returns the request ip", () => {
      expect(electraRequest.getIp()).toBe(mockExpressRequest.ip);
    });
  });
  
  describe("getPath", () => {
    it("returns the request path", () => {
      expect(electraRequest.getPath()).toBe(mockExpressRequest.path);
    });
  });
  
  describe("getProtocol", () => {
    it("returns the request protocol", () => {
      expect(electraRequest.getProtocol()).toBe(mockExpressRequest.protocol);
    });
  });
  
  describe("getHeader", () => {
    it("returns the request header value", () => {
      expect(electraRequest.getHeader("example")).toBe(mockExpressRequest.get("example"));
    });
  });
  
  describe("isSecure", () => {
    it("returns the request secure value", () => {
      expect(electraRequest.isSecure()).toBe(mockExpressRequest.secure);
    });
  });
  
  describe("get & set work correctly", () => {
    it("get returns undefined if no custom values set", () => {
      expect(electraRequest.get("test")).toBeUndefined();
    });
    
    it("set returns provider instance", () => {
      expect(electraRequest.set("example", "value")).toBe(electraRequest);
    });
    
    it("get returns the value set", () => {
      electraRequest.set("example", "value");
      expect(electraRequest.get("example")).toBe("value");
    });
  });
  
});
