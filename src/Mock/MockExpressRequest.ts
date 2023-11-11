
export class MockExpressRequest
{
  public cookies = {
    exampleOne: "value1",
    exampleTwo: "value2"
  };
  public params = {
    exampleOne: "value1",
    exampleTwo: "value2"
  };
  public query = {
    exampleOne: "value1",
    exampleTwo: "value2"
  };
  public body = {
    exampleOne: "value1",
    exampleTwo: "value2",
    testFunction: () => {}
  };
  public hostname = "hostname";
  public ip = "127.0.0.1";
  public path = "/test";
  public protocol = "http";
  public get = jest.fn().mockReturnValue("header value");
  public secure = false;
  public electra: { [key: string]: any } = undefined;
}
