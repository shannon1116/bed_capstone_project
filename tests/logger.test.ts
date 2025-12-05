import fs from "fs";
import path from "path";
import morgan from "morgan";
import { Request, Response } from "express";

jest.mock("fs");
jest.mock("path");
jest.mock("morgan");

const mockExistsSync = jest.fn();
const mockMkdirSync = jest.fn();
const mockCreateWriteStream = jest.fn();
const mockAppendFileSync = jest.fn();

(fs.existsSync as jest.Mock) = mockExistsSync;
(fs.mkdirSync as jest.Mock) = mockMkdirSync;
(fs.createWriteStream as jest.Mock) = mockCreateWriteStream;
(fs.appendFileSync as jest.Mock) = mockAppendFileSync;

(path.join as jest.Mock).mockImplementation((...args: string[]) =>
  args.join("/")
);

const mockedMorgan = morgan as unknown as jest.MockedFunction<
  (
    format: string,
    options?: any
  ) => (req: Request, res: Response, next: () => void) => void
>;

mockedMorgan.mockImplementation((format: string, options?: any) => {
  const middleware = jest.fn((_: Request, __: Response, next: () => void) =>
    next()
  );
  (middleware as any).format = format;
  (middleware as any).options = options;
  return middleware;
});

describe("Logger middleware configuration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create logs directory and configure log streams", () => {
    mockExistsSync.mockReturnValue(false);
    mockCreateWriteStream.mockReturnValue({} as any);

    const { accessLogger, errorLogger, consoleLogger } =
      require("../src/api/v1/middleware/logger");

    // Directory creation
    expect(fs.existsSync).toHaveBeenCalledWith(expect.stringContaining("/logs"));
    expect(fs.mkdirSync).toHaveBeenCalledWith(expect.stringContaining("/logs"), {
      recursive: true,
    });

    // Only access logger uses createWriteStream
    expect(fs.createWriteStream).toHaveBeenCalledTimes(1);
    expect(fs.createWriteStream).toHaveBeenCalledWith(
      expect.stringContaining("/access.log"),
      { flags: "a" }
    );

    // error logger uses appendFileSync -- but NOT during initialization
    expect(fs.appendFileSync).not.toHaveBeenCalled();

    // morgan calls
    expect(mockedMorgan).toHaveBeenCalledTimes(3);

    const calls = mockedMorgan.mock.calls;

    // 1. access logger
    expect(calls[0][0]).toBe("combined");
    expect(calls[0][1].stream).toBeDefined();

    // 2. error logger
    const errorOptions = calls[1][1];
    expect(typeof errorOptions.skip).toBe("function");

    const req = {} as Request;
    const res200 = { statusCode: 200 } as Response;
    const res500 = { statusCode: 500 } as Response;

    expect(errorOptions.skip(req, res200)).toBe(true);
    expect(errorOptions.skip(req, res500)).toBe(false);

    // 3. console logger
    expect(calls[2][0]).toBe("dev");

    // Run middleware functions
    const mockReq = {} as Request;
    const mockRes = { statusCode: 200 } as Response;
    const mockNext = jest.fn();

    accessLogger(mockReq, mockRes, mockNext);
    errorLogger(mockReq, mockRes, mockNext);
    consoleLogger(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(3);
  });

  it("should not recreate logs directory if it already exists", () => {
    mockExistsSync.mockReturnValue(true);

    require("../src/api/v1/middleware/logger");

    expect(fs.mkdirSync).not.toHaveBeenCalled();
  });
});
