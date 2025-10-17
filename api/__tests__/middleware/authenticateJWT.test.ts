import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticateJWT, optionalAuthenticateJWT } from '../../middleware/authenticateJWT';

// Mock jwt and logger
jest.mock('jsonwebtoken');
jest.mock('../../utils/logger');

// Unmock the middleware for this test file
jest.unmock('../../middleware/authenticateJWT');

interface RequestWithUser extends Request {
  user?: {
    id: number;
    email: string;
    roles: number[];
  };
}

describe('authenticateJWT Middleware', () => {
  let mockRequest: Partial<RequestWithUser>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
      method: 'GET',
      url: '/test',
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret-key';
  });

  describe('authenticateJWT', () => {
    it('should authenticate valid JWT token and attach user to request', () => {
      // Setup
      const mockDecoded = {
        id: 1,
        email: 'test@example.com',
        roles: [1, 2],
      };
      mockRequest.headers = {
        authorization: 'Bearer valid-token-here',
      };
      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      // Execute
      authenticateJWT(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith('valid-token-here', 'test-secret-key');
      expect(mockRequest.user).toEqual({
        id: 1,
        email: 'test@example.com',
        roles: [1, 2],
      });
      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should return 401 when no authorization header is provided', () => {
      // Setup
      mockRequest.headers = {};

      // Execute
      authenticateJWT(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'No token provided',
      });
      expect(nextFunction).not.toHaveBeenCalled();
      expect(jwt.verify).not.toHaveBeenCalled();
    });

    it('should return 401 when authorization header does not start with Bearer', () => {
      // Setup
      mockRequest.headers = {
        authorization: 'Basic some-credentials',
      };

      // Execute
      authenticateJWT(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'No token provided',
      });
      expect(nextFunction).not.toHaveBeenCalled();
      expect(jwt.verify).not.toHaveBeenCalled();
    });

    it('should return 401 when token is invalid', () => {
      // Setup
      mockRequest.headers = {
        authorization: 'Bearer invalid-token',
      };
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Execute
      authenticateJWT(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith('invalid-token', 'test-secret-key');
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid or expired token',
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 401 when token is expired', () => {
      // Setup
      mockRequest.headers = {
        authorization: 'Bearer expired-token',
      };
      const expiredError = new Error('jwt expired');
      expiredError.name = 'TokenExpiredError';
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw expiredError;
      });

      // Execute
      authenticateJWT(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith('expired-token', 'test-secret-key');
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid or expired token',
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should handle token with empty roles array', () => {
      // Setup
      const mockDecoded = {
        id: 5,
        email: 'noroles@example.com',
        roles: [],
      };
      mockRequest.headers = {
        authorization: 'Bearer valid-token',
      };
      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      // Execute
      authenticateJWT(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(mockRequest.user).toEqual({
        id: 5,
        email: 'noroles@example.com',
        roles: [],
      });
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should handle token without roles property', () => {
      // Setup
      const mockDecoded = {
        id: 10,
        email: 'user@example.com',
        // No roles property
      };
      mockRequest.headers = {
        authorization: 'Bearer valid-token',
      };
      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      // Execute
      authenticateJWT(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(mockRequest.user).toEqual({
        id: 10,
        email: 'user@example.com',
        roles: [], // Should default to empty array
      });
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should use JWT_SECRET from environment variable', () => {
      // Setup
      process.env.JWT_SECRET = 'custom-secret-key';
      mockRequest.headers = {
        authorization: 'Bearer test-token',
      };
      (jwt.verify as jest.Mock).mockReturnValue({
        id: 1,
        email: 'test@example.com',
        roles: [1],
      });

      // Execute
      authenticateJWT(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith('test-token', 'custom-secret-key');
    });
  });

  describe('optionalAuthenticateJWT', () => {
    it('should authenticate valid JWT token when provided', () => {
      // Setup
      const mockDecoded = {
        id: 3,
        email: 'optional@example.com',
        roles: [2],
      };
      mockRequest.headers = {
        authorization: 'Bearer valid-token',
      };
      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      // Execute
      optionalAuthenticateJWT(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret-key');
      expect(mockRequest.user).toEqual({
        id: 3,
        email: 'optional@example.com',
        roles: [2],
      });
      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should continue without authentication when no token provided', () => {
      // Setup
      mockRequest.headers = {};

      // Execute
      optionalAuthenticateJWT(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(jwt.verify).not.toHaveBeenCalled();
      expect(mockRequest.user).toBeUndefined();
      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should continue without authentication when authorization header does not start with Bearer', () => {
      // Setup
      mockRequest.headers = {
        authorization: 'Basic credentials',
      };

      // Execute
      optionalAuthenticateJWT(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(jwt.verify).not.toHaveBeenCalled();
      expect(mockRequest.user).toBeUndefined();
      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should continue without authentication when token is invalid', () => {
      // Setup
      mockRequest.headers = {
        authorization: 'Bearer invalid-token',
      };
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Execute
      optionalAuthenticateJWT(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith('invalid-token', 'test-secret-key');
      expect(mockRequest.user).toBeUndefined();
      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should continue without authentication when token is expired', () => {
      // Setup
      mockRequest.headers = {
        authorization: 'Bearer expired-token',
      };
      const expiredError = new Error('jwt expired');
      expiredError.name = 'TokenExpiredError';
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw expiredError;
      });

      // Execute
      optionalAuthenticateJWT(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith('expired-token', 'test-secret-key');
      expect(mockRequest.user).toBeUndefined();
      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should handle token without roles property', () => {
      // Setup
      const mockDecoded = {
        id: 7,
        email: 'noroles@example.com',
      };
      mockRequest.headers = {
        authorization: 'Bearer valid-token',
      };
      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      // Execute
      optionalAuthenticateJWT(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(mockRequest.user).toEqual({
        id: 7,
        email: 'noroles@example.com',
        roles: [],
      });
      expect(nextFunction).toHaveBeenCalled();
    });
  });
});
