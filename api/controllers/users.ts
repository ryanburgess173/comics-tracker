import { Router, Request, Response } from 'express';
import User from '../models/User';
import Role from '../models/Role';
import UserRoleXRef from '../models/UserRoleXRef';
import bcrypt from 'bcrypt';
import logger from '../utils/logger';
import { authorize } from '../middleware/checkPermissions';

const router = Router();
const SALT_ROUNDS = 10;

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: |
 *       Retrieve a list of all users in the system.
 *       Requires the 'users:list' permission.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions (requires 'users:list')
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', ...authorize(['users:list']), async (req: Request, res: Response) => {
  try {
    logger.info('Fetching all users');
    const users = await User.findAll({
      attributes: { exclude: ['passwordHash', 'resetPasswordToken', 'resetPasswordExpires'] },
    });
    res.json(users);
  } catch (error) {
    logger.error('Error fetching users: %o', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: |
 *       Retrieve a specific user by their ID.
 *       Requires the 'user:read' permission.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions (requires 'user:read')
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', ...authorize(['user:read']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching user with id: ${id}`);

    const user = await User.findByPk(id, {
      attributes: { exclude: ['passwordHash', 'resetPasswordToken', 'resetPasswordExpires'] },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    logger.error('Error fetching user: %o', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: |
 *       Add a new user to the system.
 *       Requires the 'user:create' permission.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePass123!
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions (requires 'user:create')
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', ...authorize(['user:create']), async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body as {
      username?: string;
      email?: string;
      password?: string;
    };

    logger.info(`Creating new user: ${username}`);

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await User.create({
      username,
      email,
      passwordHash,
    });

    // Remove sensitive data before sending response
    const userResponse = user.toJSON() as unknown as Record<string, unknown>;
    delete userResponse.passwordHash;
    delete userResponse.resetPasswordToken;
    delete userResponse.resetPasswordExpires;

    logger.info(`User created successfully: ${user.id}`);
    res.status(201).json(userResponse);
  } catch (error) {
    logger.error('Error creating user: %o', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     description: |
 *       Update an existing user's information.
 *       Requires the 'user:update' permission.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions (requires 'user:update')
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', ...authorize(['user:update']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body as { username?: string; email?: string };

    logger.info(`Updating user with id: ${id}`);

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user fields
    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    // Remove sensitive data
    const userResponse = user.toJSON() as unknown as Record<string, unknown>;
    delete userResponse.passwordHash;
    delete userResponse.resetPasswordToken;
    delete userResponse.resetPasswordExpires;

    logger.info(`User updated successfully: ${id}`);
    res.json(userResponse);
  } catch (error) {
    logger.error('Error updating user: %o', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: |
 *       Remove a user from the system.
 *       Requires the 'user:delete' permission.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions (requires 'user:delete')
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', ...authorize(['user:delete']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    logger.info(`Deleting user with id: ${id}`);

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();

    logger.info(`User deleted successfully: ${id}`);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error('Error deleting user: %o', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

/**
 * @swagger
 * /users/{id}/change-password:
 *   post:
 *     summary: Change user password
 *     description: |
 *       Change a user's password by verifying the current password.
 *       Requires the 'user:update' permission.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Bad request - missing fields or incorrect current password
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions (requires 'user:update')
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post(
  '/:id/change-password',
  ...authorize(['user:update']),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { currentPassword, newPassword } = req.body;

      // Validate required fields
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          error: 'Current password and new password are required',
        });
      }

      // Find user
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify current password

      const isValidPassword = await bcrypt.compare(currentPassword as string, user.passwordHash);
      if (!isValidPassword) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      // Hash new password and update

      const hashedPassword = await bcrypt.hash(newPassword as string, SALT_ROUNDS);
      user.passwordHash = hashedPassword;
      await user.save();
      logger.info(`Password changed successfully for user: ${id}`);
      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      logger.error('Error changing password: %o', error);
      res.status(500).json({ error: 'Failed to change password' });
    }
  }
);

/**
 * @swagger
 * /users/{id}/roles:
 *   get:
 *     summary: Get user's roles
 *     description: |
 *       Retrieve all roles assigned to a specific user.
 *       Requires the 'user:read' permission.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User roles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions (requires 'user:read')
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id/roles', ...authorize(['user:read']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching roles for user: ${id}`);

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's roles through the junction table
    const userRoles = await UserRoleXRef.findAll({
      where: { userId: id },
      include: [{ model: Role }],
    });

    const roles = userRoles.map((ur) => (ur as unknown as { Role: unknown }).Role);

    res.json(roles);
  } catch (error) {
    logger.error('Error fetching user roles: %o', error);
    res.status(500).json({ error: 'Failed to fetch user roles' });
  }
});

/**
 * @swagger
 * /users/{id}/roles:
 *   post:
 *     summary: Assign role to user
 *     description: |
 *       Add a role to a user.
 *       Requires the 'roles:write' permission.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleId
 *             properties:
 *               roleId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Role assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Role assigned successfully
 *       400:
 *         description: Invalid input or role already assigned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions (requires 'roles:write')
 *       404:
 *         description: User or role not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/:id/roles', ...authorize(['roles:write']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { roleId } = req.body as { roleId?: string };

    logger.info(`Assigning role ${roleId} to user ${id}`);

    if (!roleId) {
      return res.status(400).json({ error: 'roleId is required' });
    }

    // Check if user exists
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if role exists
    const role = await Role.findByPk(roleId);
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    // Check if user already has this role
    const existingAssignment = await UserRoleXRef.findOne({
      where: { userId: id, roleId: roleId },
    });

    if (existingAssignment) {
      return res.status(400).json({ error: 'User already has this role' });
    }

    // Assign role
    await UserRoleXRef.create({ userId: parseInt(id), roleId: parseInt(roleId) });

    logger.info(`Role assigned successfully to user ${id}`);
    res.status(201).json({ message: 'Role assigned successfully' });
  } catch (error) {
    logger.error('Error assigning role: %o', error);
    res.status(500).json({ error: 'Failed to assign role' });
  }
});

/**
 * @swagger
 * /users/{id}/roles/{roleId}:
 *   delete:
 *     summary: Remove role from user
 *     description: |
 *       Remove a role assignment from a user.
 *       Requires the 'roles:write' permission.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The role ID to remove
 *     responses:
 *       200:
 *         description: Role removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Role removed successfully
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions (requires 'roles:write')
 *       404:
 *         description: User, role, or assignment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(
  '/:id/roles/:roleId',
  ...authorize(['roles:write']),
  async (req: Request, res: Response) => {
    try {
      const { id, roleId } = req.params;
      logger.info(`Removing role ${roleId} from user ${id}`);

      const assignment = await UserRoleXRef.findOne({
        where: { userId: id, roleId },
      });

      if (!assignment) {
        return res.status(404).json({ error: 'Role assignment not found' });
      }

      await assignment.destroy();

      logger.info(`Role removed successfully from user ${id}`);
      res.json({ message: 'Role removed successfully' });
    } catch (error) {
      logger.error('Error removing role: %o', error);
      res.status(500).json({ error: 'Failed to remove role' });
    }
  }
);

export default router;
