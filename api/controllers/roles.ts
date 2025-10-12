import { Router, Request, Response } from 'express';
import Role from '../models/Role';
import Permission from '../models/Permission';
import RolePermissionXRef from '../models/RolePermissionXRef';
import logger from '../utils/logger';

const router = Router();

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Get all roles
 *     description: Retrieve a list of all roles in the system
 *     tags:
 *       - Roles
 *     responses:
 *       200:
 *         description: List of roles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    logger.info('Fetching all roles');
    const roles = await Role.findAll({
      order: [['name', 'ASC']],
    });
    res.json(roles);
  } catch (error) {
    logger.error('Error fetching roles: %o', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

/**
 * @swagger
 * /roles/{id}:
 *   get:
 *     summary: Get a role by ID
 *     description: Retrieve a specific role by its ID
 *     tags:
 *       - Roles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The role ID
 *     responses:
 *       200:
 *         description: Role retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: Role not found
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
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching role with id: ${id}`);

    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    res.json(role);
  } catch (error) {
    logger.error('Error fetching role: %o', error);
    res.status(500).json({ error: 'Failed to fetch role' });
  }
});

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Create a new role
 *     description: Add a new role to the system
 *     tags:
 *       - Roles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Moderator
 *               description:
 *                 type: string
 *                 example: Can moderate content and manage users
 *     responses:
 *       201:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       400:
 *         description: Invalid input or role already exists
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
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    logger.info(`Creating new role: ${name}`);

    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Check if role already exists
    const existingRole = await Role.findOne({
      where: { name },
    });

    if (existingRole) {
      return res.status(400).json({ error: 'Role with this name already exists' });
    }

    // Create role
    const role = await Role.create({
      name,
      description,
    });

    logger.info(`Role created successfully: ${role.id}`);
    res.status(201).json(role);
  } catch (error) {
    logger.error('Error creating role: %o', error);
    res.status(500).json({ error: 'Failed to create role' });
  }
});

/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     summary: Update a role
 *     description: Update an existing role's information
 *     tags:
 *       - Roles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The role ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: Role not found
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
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    logger.info(`Updating role with id: ${id}`);

    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    // Update role fields
    if (name) role.name = name;
    if (description !== undefined) role.description = description;

    await role.save();

    logger.info(`Role updated successfully: ${id}`);
    res.json(role);
  } catch (error) {
    logger.error('Error updating role: %o', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: Delete a role
 *     description: Remove a role from the system
 *     tags:
 *       - Roles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The role ID
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Role deleted successfully
 *       404:
 *         description: Role not found
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
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    logger.info(`Deleting role with id: ${id}`);

    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    await role.destroy();

    logger.info(`Role deleted successfully: ${id}`);
    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    logger.error('Error deleting role: %o', error);
    res.status(500).json({ error: 'Failed to delete role' });
  }
});

/**
 * @swagger
 * /roles/{id}/permissions:
 *   get:
 *     summary: Get role's permissions
 *     description: Retrieve all permissions assigned to a specific role
 *     tags:
 *       - Roles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The role ID
 *     responses:
 *       200:
 *         description: Role permissions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Permission'
 *       404:
 *         description: Role not found
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
router.get('/:id/permissions', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching permissions for role: ${id}`);

    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    // Get role's permissions through the junction table
    const rolePermissions = await RolePermissionXRef.findAll({
      where: { roleId: id },
      include: [{ model: Permission }],
    });

    const permissions = rolePermissions.map((rp: any) => rp.Permission);

    res.json(permissions);
  } catch (error) {
    logger.error('Error fetching role permissions: %o', error);
    res.status(500).json({ error: 'Failed to fetch role permissions' });
  }
});

/**
 * @swagger
 * /roles/{id}/permissions:
 *   post:
 *     summary: Assign permission to role
 *     description: Add a permission to a role
 *     tags:
 *       - Roles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The role ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permissionId
 *             properties:
 *               permissionId:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       201:
 *         description: Permission assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Permission assigned successfully
 *       400:
 *         description: Invalid input or permission already assigned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Role or permission not found
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
router.post('/:id/permissions', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { permissionId } = req.body;

    logger.info(`Assigning permission ${permissionId} to role ${id}`);

    if (!permissionId) {
      return res.status(400).json({ error: 'permissionId is required' });
    }

    // Check if role exists
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    // Check if permission exists
    const permission = await Permission.findByPk(permissionId);
    if (!permission) {
      return res.status(404).json({ error: 'Permission not found' });
    }

    // Check if role already has this permission
    const existingAssignment = await RolePermissionXRef.findOne({
      where: { roleId: id, permissionId },
    });

    if (existingAssignment) {
      return res.status(400).json({ error: 'Role already has this permission' });
    }

    // Assign permission
    await RolePermissionXRef.create({ roleId: parseInt(id), permissionId: parseInt(permissionId) });

    logger.info(`Permission assigned successfully to role ${id}`);
    res.status(201).json({ message: 'Permission assigned successfully' });
  } catch (error) {
    logger.error('Error assigning permission: %o', error);
    res.status(500).json({ error: 'Failed to assign permission' });
  }
});

/**
 * @swagger
 * /roles/{id}/permissions/{permissionId}:
 *   delete:
 *     summary: Remove permission from role
 *     description: Remove a permission assignment from a role
 *     tags:
 *       - Roles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The role ID
 *       - in: path
 *         name: permissionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The permission ID to remove
 *     responses:
 *       200:
 *         description: Permission removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Permission removed successfully
 *       404:
 *         description: Role, permission, or assignment not found
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
router.delete('/:id/permissions/:permissionId', async (req: Request, res: Response) => {
  try {
    const { id, permissionId } = req.params;
    logger.info(`Removing permission ${permissionId} from role ${id}`);

    const assignment = await RolePermissionXRef.findOne({
      where: { roleId: id, permissionId },
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Permission assignment not found' });
    }

    await assignment.destroy();

    logger.info(`Permission removed successfully from role ${id}`);
    res.json({ message: 'Permission removed successfully' });
  } catch (error) {
    logger.error('Error removing permission: %o', error);
    res.status(500).json({ error: 'Failed to remove permission' });
  }
});

/**
 * @swagger
 * /roles/{id}/permissions/bulk:
 *   post:
 *     summary: Assign multiple permissions to role
 *     description: Add multiple permissions to a role at once
 *     tags:
 *       - Roles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The role ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permissionIds
 *             properties:
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3, 5, 8]
 *     responses:
 *       201:
 *         description: Permissions assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 5 permissions assigned successfully
 *                 assigned:
 *                   type: integer
 *                   example: 5
 *                 skipped:
 *                   type: integer
 *                   example: 0
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Role not found
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
router.post('/:id/permissions/bulk', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { permissionIds } = req.body;

    logger.info(`Bulk assigning permissions to role ${id}`);

    if (!permissionIds || !Array.isArray(permissionIds)) {
      return res.status(400).json({ error: 'permissionIds array is required' });
    }

    // Check if role exists
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    let assigned = 0;
    let skipped = 0;

    for (const permissionId of permissionIds) {
      // Check if permission exists
      const permission = await Permission.findByPk(permissionId);
      if (!permission) {
        skipped++;
        continue;
      }

      // Check if already assigned
      const existingAssignment = await RolePermissionXRef.findOne({
        where: { roleId: id, permissionId },
      });

      if (existingAssignment) {
        skipped++;
        continue;
      }

      // Assign permission
      await RolePermissionXRef.create({
        roleId: parseInt(id),
        permissionId: parseInt(permissionId),
      });
      assigned++;
    }

    logger.info(`Bulk assignment complete: ${assigned} assigned, ${skipped} skipped`);
    res.status(201).json({
      message: `${assigned} permissions assigned successfully`,
      assigned,
      skipped,
    });
  } catch (error) {
    logger.error('Error bulk assigning permissions: %o', error);
    res.status(500).json({ error: 'Failed to bulk assign permissions' });
  }
});

export default router;
