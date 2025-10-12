import { Router, Request, Response } from 'express';
import Permission from '../models/Permission';
import logger from '../utils/logger';

const router = Router();

/**
 * @swagger
 * /permissions:
 *   get:
 *     summary: Get all permissions
 *     description: Retrieve a list of all permissions in the system
 *     tags:
 *       - Permissions
 *     responses:
 *       200:
 *         description: List of permissions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Permission'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    logger.info('Fetching all permissions');
    const permissions = await Permission.findAll({
      order: [
        ['resource', 'ASC'],
        ['action', 'ASC'],
      ],
    });
    res.json(permissions);
  } catch (error) {
    logger.error('Error fetching permissions: %o', error);
    res.status(500).json({ error: 'Failed to fetch permissions' });
  }
});

/**
 * @swagger
 * /permissions/by-resource:
 *   get:
 *     summary: Get permissions grouped by resource
 *     description: Retrieve all permissions organized by resource type
 *     tags:
 *       - Permissions
 *     responses:
 *       200:
 *         description: Permissions grouped by resource
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Permission'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/by-resource', async (req: Request, res: Response) => {
  try {
    logger.info('Fetching permissions grouped by resource');
    const permissions = await Permission.findAll({
      order: [
        ['resource', 'ASC'],
        ['action', 'ASC'],
      ],
    });

    // Group permissions by resource
    const groupedPermissions: Record<string, typeof permissions> = {};
    permissions.forEach((permission) => {
      if (!groupedPermissions[permission.resource]) {
        groupedPermissions[permission.resource] = [];
      }
      groupedPermissions[permission.resource].push(permission);
    });

    res.json(groupedPermissions);
  } catch (error) {
    logger.error('Error fetching grouped permissions: %o', error);
    res.status(500).json({ error: 'Failed to fetch grouped permissions' });
  }
});

/**
 * @swagger
 * /permissions/{id}:
 *   get:
 *     summary: Get a permission by ID
 *     description: Retrieve a specific permission by its ID
 *     tags:
 *       - Permissions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The permission ID
 *     responses:
 *       200:
 *         description: Permission retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       404:
 *         description: Permission not found
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
    logger.info(`Fetching permission with id: ${id}`);

    const permission = await Permission.findByPk(id);

    if (!permission) {
      return res.status(404).json({ error: 'Permission not found' });
    }

    res.json(permission);
  } catch (error) {
    logger.error('Error fetching permission: %o', error);
    res.status(500).json({ error: 'Failed to fetch permission' });
  }
});

/**
 * @swagger
 * /permissions:
 *   post:
 *     summary: Create a new permission
 *     description: Add a new permission to the system
 *     tags:
 *       - Permissions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - resource
 *               - action
 *             properties:
 *               name:
 *                 type: string
 *                 example: comics:create
 *               resource:
 *                 type: string
 *                 example: comics
 *               action:
 *                 type: string
 *                 example: create
 *               description:
 *                 type: string
 *                 example: Create new comics
 *     responses:
 *       201:
 *         description: Permission created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       400:
 *         description: Invalid input or permission already exists
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
    const { name, resource, action, description } = req.body as {
      name?: string;
      resource?: string;
      action?: string;
      description?: string;
    };

    logger.info(`Creating new permission: ${name}`);

    // Validate required fields
    if (!name || !resource || !action) {
      return res.status(400).json({ error: 'Name, resource, and action are required' });
    }

    // Check if permission already exists
    const existingPermission = await Permission.findOne({
      where: { name },
    });

    if (existingPermission) {
      return res.status(400).json({ error: 'Permission with this name already exists' });
    }

    // Create permission
    const permission = await Permission.create({
      name: name,
      resource: resource,
      action: action,
      description: description,
    });

    logger.info(`Permission created successfully: ${permission.id}`);
    res.status(201).json(permission);
  } catch (error) {
    logger.error('Error creating permission: %o', error);
    res.status(500).json({ error: 'Failed to create permission' });
  }
});

/**
 * @swagger
 * /permissions/{id}:
 *   put:
 *     summary: Update a permission
 *     description: Update an existing permission's information
 *     tags:
 *       - Permissions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The permission ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               resource:
 *                 type: string
 *               action:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Permission updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       404:
 *         description: Permission not found
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
    const { name, resource, action, description } = req.body as {
      name?: string;
      resource?: string;
      action?: string;
      description?: string;
    };

    logger.info(`Updating permission with id: ${id}`);

    const permission = await Permission.findByPk(id);

    if (!permission) {
      return res.status(404).json({ error: 'Permission not found' });
    }

    // Update permission fields
    if (name) permission.name = name;
    if (resource) permission.resource = resource;
    if (action) permission.action = action;
    if (description !== undefined) permission.description = description as string | undefined;

    await permission.save();

    logger.info(`Permission updated successfully: ${id}`);
    res.json(permission);
  } catch (error) {
    logger.error('Error updating permission: %o', error);
    res.status(500).json({ error: 'Failed to update permission' });
  }
});

/**
 * @swagger
 * /permissions/{id}:
 *   delete:
 *     summary: Delete a permission
 *     description: Remove a permission from the system
 *     tags:
 *       - Permissions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The permission ID
 *     responses:
 *       200:
 *         description: Permission deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Permission deleted successfully
 *       404:
 *         description: Permission not found
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
    logger.info(`Deleting permission with id: ${id}`);

    const permission = await Permission.findByPk(id);

    if (!permission) {
      return res.status(404).json({ error: 'Permission not found' });
    }

    await permission.destroy();

    logger.info(`Permission deleted successfully: ${id}`);
    res.json({ message: 'Permission deleted successfully' });
  } catch (error) {
    logger.error('Error deleting permission: %o', error);
    res.status(500).json({ error: 'Failed to delete permission' });
  }
});

export default router;
