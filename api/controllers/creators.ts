import { Router, Request, Response } from 'express';
import Creator from '../models/Creator';
import logger from '../utils/logger';
import { authorize } from '../middleware/checkPermissions';

const router = Router();

/**
 * @swagger
 * /creators:
 *   get:
 *     summary: Get all creators
 *     description: |
 *       Retrieve a list of all creators in the database.
 *       Requires the 'creators:list' permission.
 *     tags:
 *       - Creators
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of creators retrieved successfully
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
 *                   creatorType:
 *                     type: string
 *                     enum: [ARTIST, AUTHOR]
 *                   bio:
 *                     type: string
 *                   birthDate:
 *                     type: string
 *                     format: date
 *                   deathDate:
 *                     type: string
 *                     format: date
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions (requires 'creators:list')
 *       500:
 *         description: Server error
 */
router.get('/', ...authorize(['creators:list']), async (req: Request, res: Response) => {
  try {
    logger.info('Fetching all creators');
    const creators = await Creator.findAll();
    res.json(creators);
  } catch (error) {
    logger.error('Error fetching creators: %o', error);
    res.status(500).json({ error: 'Failed to fetch creators' });
  }
});

/**
 * @swagger
 * /creators/{id}:
 *   get:
 *     summary: Get a creator by ID
 *     description: |
 *       Retrieve a specific creator by its ID.
 *       Requires the 'creators:read' permission.
 *     tags:
 *       - Creators
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The creator ID
 *     responses:
 *       200:
 *         description: Creator retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 creatorType:
 *                   type: string
 *                   enum: [ARTIST, AUTHOR]
 *                 bio:
 *                   type: string
 *                 birthDate:
 *                   type: string
 *                   format: date
 *                 deathDate:
 *                   type: string
 *                   format: date
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions (requires 'creators:read')
 *       404:
 *         description: Creator not found
 *       500:
 *         description: Server error
 */
router.get('/:id', ...authorize(['creators:read']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching creator with id: ${id}`);
    const creator = await Creator.findByPk(id);

    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    res.json(creator);
  } catch (error) {
    logger.error('Error fetching creator: %o', error);
    res.status(500).json({ error: 'Failed to fetch creator' });
  }
});

/**
 * @swagger
 * /creators:
 *   post:
 *     summary: Create a new creator
 *     description: |
 *       Add a new creator to the database.
 *       Requires the 'creators:create' permission.
 *     tags:
 *       - Creators
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
 *               - creatorType
 *             properties:
 *               name:
 *                 type: string
 *               creatorType:
 *                 type: string
 *                 enum: [ARTIST, AUTHOR]
 *               bio:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               deathDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Creator created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions (requires 'creators:create')
 *       500:
 *         description: Server error
 */
router.post('/', ...authorize(['creators:create']), async (req: Request, res: Response) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { name, creatorType, bio, birthDate, deathDate } = req.body;

    if (!name || !creatorType) {
      return res.status(400).json({ error: 'Name and creatorType are required' });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (!['ARTIST', 'AUTHOR'].includes(creatorType)) {
      return res.status(400).json({ error: 'creatorType must be either ARTIST or AUTHOR' });
    }

    logger.info(`Creating new creator: ${name as string}`);
    const creator = await Creator.create({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      name,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      creatorType,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      bio,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      birthDate,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      deathDate,
    });

    res.status(201).json(creator);
  } catch (error) {
    logger.error('Error creating creator: %o', error);
    res.status(500).json({ error: 'Failed to create creator' });
  }
});

/**
 * @swagger
 * /creators/{id}:
 *   put:
 *     summary: Update a creator
 *     description: |
 *       Update an existing creator by ID.
 *       Requires the 'creators:update' permission.
 *     tags:
 *       - Creators
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The creator ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               creatorType:
 *                 type: string
 *                 enum: [ARTIST, AUTHOR]
 *               bio:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               deathDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Creator updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions (requires 'creators:update')
 *       404:
 *         description: Creator not found
 *       500:
 *         description: Server error
 */
router.put('/:id', ...authorize(['creators:update']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { name, creatorType, bio, birthDate, deathDate } = req.body;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (creatorType && !['ARTIST', 'AUTHOR'].includes(creatorType)) {
      return res.status(400).json({ error: 'creatorType must be either ARTIST or AUTHOR' });
    }

    logger.info(`Updating creator with id: ${id}`);
    const creator = await Creator.findByPk(id);

    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    await creator.update({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      name,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      creatorType,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      bio,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      birthDate,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      deathDate,
    });

    res.json(creator);
  } catch (error) {
    logger.error('Error updating creator: %o', error);
    res.status(500).json({ error: 'Failed to update creator' });
  }
});

/**
 * @swagger
 * /creators/{id}:
 *   delete:
 *     summary: Delete a creator
 *     description: |
 *       Delete a creator by ID.
 *       Requires the 'creators:delete' permission.
 *     tags:
 *       - Creators
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The creator ID
 *     responses:
 *       200:
 *         description: Creator deleted successfully
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions (requires 'creators:delete')
 *       404:
 *         description: Creator not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', ...authorize(['creators:delete']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    logger.info(`Deleting creator with id: ${id}`);
    const creator = await Creator.findByPk(id);

    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    await creator.destroy();
    res.json({ message: 'Creator deleted successfully' });
  } catch (error) {
    logger.error('Error deleting creator: %o', error);
    res.status(500).json({ error: 'Failed to delete creator' });
  }
});

export default router;
