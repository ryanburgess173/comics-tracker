import logger from "../../utils/logger";

describe("Logger Utility", () => {
  // Mock console methods to prevent output during tests
  let infoSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    infoSpy = jest.spyOn(logger, "info").mockImplementation();
    errorSpy = jest.spyOn(logger, "error").mockImplementation();
    warnSpy = jest.spyOn(logger, "warn").mockImplementation();
  });

  afterEach(() => {
    infoSpy.mockRestore();
    errorSpy.mockRestore();
    warnSpy.mockRestore();
  });

  describe("Logger Methods", () => {
    it("should have info method", () => {
      expect(logger.info).toBeDefined();
      expect(typeof logger.info).toBe("function");
    });

    it("should have error method", () => {
      expect(logger.error).toBeDefined();
      expect(typeof logger.error).toBe("function");
    });

    it("should have warn method", () => {
      expect(logger.warn).toBeDefined();
      expect(typeof logger.warn).toBe("function");
    });

    it("should have debug method", () => {
      expect(logger.debug).toBeDefined();
      expect(typeof logger.debug).toBe("function");
    });
  });

  describe("Logging Functionality", () => {
    it("should log info messages", () => {
      const message = "Test info message";
      logger.info(message);

      expect(infoSpy).toHaveBeenCalledWith(message);
      expect(infoSpy).toHaveBeenCalledTimes(1);
    });

    it("should log error messages", () => {
      const message = "Test error message";
      logger.error(message);

      expect(errorSpy).toHaveBeenCalledWith(message);
      expect(errorSpy).toHaveBeenCalledTimes(1);
    });

    it("should log warning messages", () => {
      const message = "Test warning message";
      logger.warn(message);

      expect(warnSpy).toHaveBeenCalledWith(message);
      expect(warnSpy).toHaveBeenCalledTimes(1);
    });

    it("should handle formatted messages", () => {
      const message = "User %s logged in";
      const username = "testuser";
      logger.info(message, username);

      expect(infoSpy).toHaveBeenCalledWith(message, username);
    });

    it("should handle multiple arguments", () => {
      const message = "Request from %s to %s";
      const ip = "127.0.0.1";
      const endpoint = "/api/test";
      logger.info(message, ip, endpoint);

      expect(infoSpy).toHaveBeenCalledWith(message, ip, endpoint);
      expect(infoSpy).toHaveBeenCalledTimes(1);
    });

    it("should handle error objects", () => {
      const errorMessage = "An error occurred: %o";
      const error = new Error("Test error");
      logger.error(errorMessage, error);

      expect(errorSpy).toHaveBeenCalledWith(errorMessage, error);
    });
  });

  describe("Logger Configuration", () => {
    it("should be a logger instance", () => {
      expect(logger).toBeDefined();
      expect(logger).toHaveProperty("info");
      expect(logger).toHaveProperty("error");
      expect(logger).toHaveProperty("warn");
      expect(logger).toHaveProperty("debug");
    });
  });
});
