import { Router, Request, Response } from 'express';
import Universe from '../models/Universe';
import logger from '../utils/logger';
import { authorize } from '../middleware/checkPermissions';

const router = Router();

/**
 * @swagger
 * /universes:
 *   get:
 *     summary: Get all universes
 *     description: Retrieve a list of all universes in the database
 *     tags:
 *       - Universes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of universes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   publisher:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/', ...authorize(['universes:list']), async (req: Request, res: Response) => {
  try {
    logger.info('Fetching all universes');
    const universes = await Universe.findAll();
    res.json(universes);
  } catch (error) {
    logger.error('Error fetching universes: %o', error);
    res.status(500).json({ error: 'Failed to fetch universes' });
  }
});

/**
 * @swagger
 * /universes/{id}:
 *   get:
 *     summary: Get a universe by ID
 *     description: Retrieve a specific universe by its ID
 *     tags:
 *       - Universes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The universe ID
 *     responses:
 *       200:
 *         description: Universe retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 publisher:
 *                   type: string
 *       404:
 *         description: Universe not found
 *       500:
 *         description: Server error
 */
router.get('/:id', ...authorize(['universes:read']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching universe with id: ${id}`);
    const universe = await Universe.findByPk(id);

    if (!universe) {
      return res.status(404).json({ error: 'Universe not found' });
    }

    res.json(universe);
  } catch (error) {
    logger.error('Error fetching universe: %o', error);
    res.status(500).json({ error: 'Failed to fetch universe' });
  }
});

/**
 * @swagger
 * /universes:
 *   post:
 *     summary: Create a new universe
 *     description: Add a new universe to the database
 *     tags:
 *       - Universes
 *     security:
 *       - bearerAuth: []
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
 *               description:
 *                 type: string
 *               publisher:
 *                 type: string
 *     responses:
 *       201:
 *         description: Universe created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', ...authorize(['universes:create']), async (req: Request, res: Response) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { name, description, publisherId } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    logger.info(`Creating new universe: ${name as string}`);
    const universe = await Universe.create({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      name,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      description,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      publisherId,
    });

    res.status(201).json(universe);
  } catch (error) {
    logger.error('Error creating universe: %o', error);
    res.status(500).json({ error: 'Failed to create universe' });
  }
});

/**
 * @swagger
 * /universes/{id}:
 *   put:
 *     summary: Update a universe
 *     description: Update an existing universe by ID
 *     tags:
 *       - Universes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The universe ID
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
 *               publisher:
 *                 type: string
 *     responses:
 *       200:
 *         description: Universe updated successfully
 *       404:
 *         description: Universe not found
 *       500:
 *         description: Server error
 */
router.put('/:id', ...authorize(['universes:update']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { name, description, publisherId } = req.body;

    logger.info(`Updating universe with id: ${id}`);
    const universe = await Universe.findByPk(id);

    if (!universe) {
      return res.status(404).json({ error: 'Universe not found' });
    }

    await universe.update({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      name,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      description,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      publisherId,
    });

    res.json(universe);
  } catch (error) {
    logger.error('Error updating universe: %o', error);
    res.status(500).json({ error: 'Failed to update universe' });
  }
});

/**
 * @swagger
 * /universes/{id}:
 *   delete:
 *     summary: Delete a universe
 *     description: Delete a universe by ID
 *     tags:
 *       - Universes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The universe ID
 *     responses:
 *       200:
 *         description: Universe deleted successfully
 *       404:
 *         description: Universe not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', ...authorize(['universes:delete']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    logger.info(`Deleting universe with id: ${id}`);
    const universe = await Universe.findByPk(id);

    if (!universe) {
      return res.status(404).json({ error: 'Universe not found' });
    }

    await universe.destroy();
    res.json({ message: 'Universe deleted successfully' });
  } catch (error) {
    logger.error('Error deleting universe: %o', error);
    res.status(500).json({ error: 'Failed to delete universe' });
  }
});

export default router;
