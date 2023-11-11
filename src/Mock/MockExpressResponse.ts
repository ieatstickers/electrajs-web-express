
export class MockExpressResponse
{
  public get = jest.fn().mockReturnValue("test header value");
  public set = jest.fn();
  public cookie = jest.fn();
  public download = jest.fn();
  public end = jest.fn();
  public json = jest.fn();
  public redirect = jest.fn();
  public send = jest.fn();
  public sendFile = jest.fn();
  public status = jest.fn();
}
