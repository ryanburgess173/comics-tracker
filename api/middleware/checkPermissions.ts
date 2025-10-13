import { Request, Response, NextFunction } from 'express';
import RolePermissionXRef from '../models/RolePermissionXRef';
import Permission from '../models/Permission';
import logger from '../utils/logger';

/**
 * Middleware factory to check if user has required permissions
 * NOTE: This middleware requires authenticateJWT to be used first!
 * It expects req.user to be populated by the JWT authentication middleware.
 *
 * @param requiredPermissions - Array of permission names required (e.g., ['comics:read', 'comics:write'])
 * @returns Express middleware function
 *
 * @example
 * router.get('/', authenticateJWT, requirePermissions(['comics:read']), handler);
 */
export const requirePermissions = (requiredPermissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      // Check if user is authenticated (should be set by authenticateJWT middleware)
      if (!user) {
        logger.error('requirePermissions called without authenticateJWT middleware');
        return res.status(401).json({
          message: 'Authentication required. No user information found.',
        });
      }

      if (!user.roles || user.roles.length === 0) {
        logger.warn('User %s has no roles assigned', user.email);
        return res.status(403).json({ message: 'Access denied. No roles assigned.' });
      }

      // Get all permissions for the user's roles
      const userRoles = user.roles;

      const rolePermissions = await RolePermissionXRef.findAll({
        where: { roleId: userRoles },
        include: [{ model: Permission, attributes: ['name'] }],
      });

      // Extract permission names
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      const userPermissions = rolePermissions.map((rp: any) => rp.Permission?.name).filter(Boolean);

      // Check if user has all required permissions
      const hasAllPermissions = requiredPermissions.every((perm) => userPermissions.includes(perm));

      if (!hasAllPermissions) {
        logger.warn(
          'User %s lacks required permissions. Has: %o, Needs: %o',
          user.email,
          userPermissions,
          requiredPermissions
        );
        return res.status(403).json({
          message: 'Access denied. Insufficient permissions.',
          required: requiredPermissions,
          has: userPermissions,
        });
      }

      logger.info('User %s authorized with permissions: %o', user.email, userPermissions);
      next();
    } catch (error: unknown) {
      logger.error('Error checking permissions: %o', error);
      return res.status(500).json({ message: 'Error checking permissions' });
    }
  };
};
