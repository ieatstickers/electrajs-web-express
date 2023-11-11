import { ExpressResponseProvider } from "./ExpressResponseProvider";
import { MockExpressResponse } from "./Mock/MockExpressResponse";

describe("ExpressResponseProvider", () => {

  let provider: ExpressResponseProvider;
  let mockResponse: MockExpressResponse;
  
  beforeEach(() => {
    mockResponse = new MockExpressResponse();
    provider = new ExpressResponseProvider(mockResponse as any);
  });
  
  describe("constructor", () => {
    it("sets the express response", () => {
      expect(provider['response']).toBe(mockResponse);
    });
  });
  
  describe("headers", () => {
    
    describe("get", () => {
      it("returns the header value", () => {
        expect(provider.headers().get("test-header")).toBe("test header value");
      });
      
      it("returns undefined if the header does not exist", () => {
        mockResponse.get = jest.fn().mockReturnValue(undefined);
        expect(provider.headers().get("test-header-two")).toBe(undefined);
      });
    })
    
    describe("set", () => {
      it("sets the header value", () => {
        provider.headers().set("test-header", "new value");
        expect(mockResponse.set).toHaveBeenCalledTimes(1);
        expect(mockResponse.set).toHaveBeenCalledWith("test-header", "new value");
      });
    });
  });
  
  describe("setCookie", () => {
    it("sets the cookie", () => {
      provider.setCookie("test-cookie", "test value", {
        domain: "test-domain",
        encode: (value: string) => value,
        expires: new Date(),
        httpOnly: true,
        maxAge: 100,
        path: "/test-path",
        secure: true,
        sameSite: "strict",
      });
      expect(mockResponse.cookie).toHaveBeenCalledTimes(1);
      expect(mockResponse.cookie).toHaveBeenCalledWith("test-cookie", "test value", {
        domain: "test-domain",
        encode: expect.any(Function),
        expires: expect.any(Date),
        httpOnly: true,
        maxAge: 100,
        path: "/test-path",
        secure: true,
        sameSite: "strict",
      });
    });
  });
  
  describe("download", () => {
    it("downloads the file", async () => {
      mockResponse.download = jest.fn().mockImplementation((filepath, filename, options, callback) => {
        callback();
      });
      await expect(
        provider.download("test-filepath.png", {
          filename: "test_filename.png",
          maxAge: 100,
          headers: {
            "test-header": "test header value",
          },
          cacheControl: true,
        })
      )
      .resolves
      .toBe(undefined);
      expect(mockResponse.download).toHaveBeenCalledTimes(1);
      expect(mockResponse.download).toHaveBeenCalledWith(
        "test-filepath.png",
        "test_filename.png",
        {
          maxAge: 100,
          headers: {
            "test-header": "test header value",
          },
          cacheControl: true,
        },
        expect.any(Function)
      );
    });
    
    it("throws an error if the download fails", async () => {
      mockResponse.download = jest.fn().mockImplementation((filepath, filename, options, callback) => {
        callback(new Error("test error"));
      });
      await expect(provider.download("test-filepath.png")).rejects.toThrow("test error");
    });
  });
  
  describe("end", () => {
    it("ends the response", () => {
      provider.end();
      expect(mockResponse.end).toHaveBeenCalledTimes(1);
    });
  });
  
  describe("json", () => {
    it("sends the json", () => {
      provider.json({ test: "test" });
      expect(mockResponse.json).toHaveBeenCalledTimes(1);
      expect(mockResponse.json).toHaveBeenCalledWith({ test: "test" });
    });
  });
  
  describe("redirect", () => {
    it("redirects to the url", () => {
      provider.redirect("/test");
      expect(mockResponse.redirect).toHaveBeenCalledTimes(1);
      expect(mockResponse.redirect).toHaveBeenCalledWith("/test");
    });
    
    it("redirects to the url with the status code", () => {
      provider.redirect(301, "/test");
      expect(mockResponse.redirect).toHaveBeenCalledTimes(1);
      expect(mockResponse.redirect).toHaveBeenCalledWith(301, "/test");
    });
    
    it("throws an error if no URL is provided", () => {
      expect(() => provider.redirect(301)).toThrow("Invalid redirect parameters");
    });
    
    it("throws an error if the status code is not a number", () => {
      expect(() => provider.redirect("301" as any, "/test")).toThrow("Invalid redirect parameters");
    });
  });
  
  describe("send", () => {
    it("sends the body", () => {
      provider.send({ test: "test" });
      expect(mockResponse.send).toHaveBeenCalledTimes(1);
      expect(mockResponse.send).toHaveBeenCalledWith({ test: "test" });
    });
  });
  
  describe("sendFile", () => {
    it("sends the file", () => {
      provider.sendFile("test-filepath", {
        maxAge: 100,
        lastModifiedEnabled: true,
        headers: {
          "test-header": "test header value",
        },
        cacheControl: true,
      });
      expect(mockResponse.sendFile).toHaveBeenCalledTimes(1);
      expect(mockResponse.sendFile).toHaveBeenCalledWith("test-filepath", {
        maxAge: 100,
        lastModifiedEnabled: true,
        headers: {
          "test-header": "test header value",
        },
        cacheControl: true,
      });
    });
  });
  
  describe("setStatus", () => {
    it("sets the status code", () => {
      provider.setStatus(200);
      expect(mockResponse.status).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

});
