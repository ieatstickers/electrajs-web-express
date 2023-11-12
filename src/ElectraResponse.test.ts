import { ElectraResponse } from "./ElectraResponse";
import { MockExpressResponse } from "./Mock/MockExpressResponse";

describe("ElectraResponse", () => {

  let electraResponse: ElectraResponse;
  let mockExpressResponse: MockExpressResponse;
  
  beforeEach(() => {
    mockExpressResponse = new MockExpressResponse();
    electraResponse = new ElectraResponse(mockExpressResponse as any);
  });
  
  describe("constructor", () => {
    it("sets the express response", () => {
      expect(electraResponse['response']).toBe(mockExpressResponse);
    });
  });
  
  describe("headers", () => {
    
    describe("get", () => {
      it("returns the header value", () => {
        expect(electraResponse.headers().get("test-header")).toBe("test header value");
      });
      
      it("returns undefined if the header does not exist", () => {
        mockExpressResponse.get = jest.fn().mockReturnValue(undefined);
        expect(electraResponse.headers().get("test-header-two")).toBe(undefined);
      });
    })
    
    describe("set", () => {
      it("sets the header value", () => {
        electraResponse.headers().set("test-header", "new value");
        expect(mockExpressResponse.set).toHaveBeenCalledTimes(1);
        expect(mockExpressResponse.set).toHaveBeenCalledWith("test-header", "new value");
      });
    });
  });
  
  describe("setCookie", () => {
    it("sets the cookie", () => {
      electraResponse.setCookie("test-cookie", "test value", {
        domain: "test-domain",
        encode: (value: string) => value,
        expires: new Date(),
        httpOnly: true,
        maxAge: 100,
        path: "/test-path",
        secure: true,
        sameSite: "strict",
      });
      expect(mockExpressResponse.cookie).toHaveBeenCalledTimes(1);
      expect(mockExpressResponse.cookie).toHaveBeenCalledWith("test-cookie", "test value", {
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
      mockExpressResponse.download = jest.fn().mockImplementation((filepath, filename, options, callback) => {
        callback();
      });
      await expect(
        electraResponse.download("test-filepath.png", {
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
      expect(mockExpressResponse.download).toHaveBeenCalledTimes(1);
      expect(mockExpressResponse.download).toHaveBeenCalledWith(
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
      mockExpressResponse.download = jest.fn().mockImplementation((filepath, filename, options, callback) => {
        callback(new Error("test error"));
      });
      await expect(electraResponse.download("test-filepath.png")).rejects.toThrow("test error");
    });
  });
  
  describe("end", () => {
    it("ends the response", () => {
      electraResponse.end();
      expect(mockExpressResponse.end).toHaveBeenCalledTimes(1);
    });
  });
  
  describe("json", () => {
    it("sends the json", () => {
      electraResponse.json({ test: "test" });
      expect(mockExpressResponse.json).toHaveBeenCalledTimes(1);
      expect(mockExpressResponse.json).toHaveBeenCalledWith({ test: "test" });
    });
  });
  
  describe("redirect", () => {
    it("redirects to the url", () => {
      electraResponse.redirect("/test");
      expect(mockExpressResponse.redirect).toHaveBeenCalledTimes(1);
      expect(mockExpressResponse.redirect).toHaveBeenCalledWith("/test");
    });
    
    it("redirects to the url with the status code", () => {
      electraResponse.redirect(301, "/test");
      expect(mockExpressResponse.redirect).toHaveBeenCalledTimes(1);
      expect(mockExpressResponse.redirect).toHaveBeenCalledWith(301, "/test");
    });
    
    it("throws an error if no URL is provided", () => {
      expect(() => electraResponse.redirect(301)).toThrow("Invalid redirect parameters");
    });
    
    it("throws an error if the status code is not a number", () => {
      expect(() => electraResponse.redirect("301" as any, "/test")).toThrow("Invalid redirect parameters");
    });
  });
  
  describe("send", () => {
    it("sends the body", () => {
      electraResponse.send({ test: "test" });
      expect(mockExpressResponse.send).toHaveBeenCalledTimes(1);
      expect(mockExpressResponse.send).toHaveBeenCalledWith({ test: "test" });
    });
  });
  
  describe("sendFile", () => {
    it("sends the file", () => {
      electraResponse.sendFile("test-filepath", {
        maxAge: 100,
        lastModifiedEnabled: true,
        headers: {
          "test-header": "test header value",
        },
        cacheControl: true,
      });
      expect(mockExpressResponse.sendFile).toHaveBeenCalledTimes(1);
      expect(mockExpressResponse.sendFile).toHaveBeenCalledWith("test-filepath", {
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
      electraResponse.setStatus(200);
      expect(mockExpressResponse.status).toHaveBeenCalledTimes(1);
      expect(mockExpressResponse.status).toHaveBeenCalledWith(200);
    });
  });

});
