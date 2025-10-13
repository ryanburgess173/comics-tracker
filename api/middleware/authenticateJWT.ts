import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';

/**
 * Middleware to authenticate JWT token and attach user info to request
 * This should be used before checkPermissions middleware
 */
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('No token provided for %s %s', req.method, req.url);
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  const secret_key = process.env.JWT_SECRET || 'your-secret-key';

  try {
    const decoded = jwt.verify(token, secret_key) as {
      id: number;
      email: string;
      roles: number[];
    };

    // Attach user info to request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
      roles: decoded.roles || [],
    };

    logger.info('Authenticated user %s with roles %o', decoded.email, decoded.roles);
    next();
  } catch (error) {
    logger.warn('Invalid token for %s %s: %o', req.method, req.url, error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

/**
 * Optional JWT middleware - authenticates if token is present but doesn't require it
 * Useful for endpoints that work differently for authenticated vs unauthenticated users
 */
export const optionalAuthenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No token provided, continue without authentication
    return next();
  }

  const token = authHeader.substring(7);
  const secret_key = process.env.JWT_SECRET || 'your-secret-key';

  try {
    const decoded = jwt.verify(token, secret_key) as {
      id: number;
      email: string;
      roles: number[];
    };

    req.user = {
      id: decoded.id,
      email: decoded.email,
      roles: decoded.roles || [],
    };

    logger.info('Optionally authenticated user %s', decoded.email);
    next();
  } catch {
    // Invalid token, but continue anyway since it's optional
    logger.debug('Optional auth: Invalid token for %s %s', req.method, req.url);
    next();
  }
};
