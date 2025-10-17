import { Router, Request, Response } from 'express';
import Comic from '../models/Comic';
import logger from '../utils/logger';
import { authenticateJWT } from '../middleware/authenticateJWT';
import { authorize } from '../middleware/checkPermissions';

const router = Router();

/**
 * @swagger
 * /comics:
 *   get:
 *     summary: Get all comics
 *     description: |
 *       Retrieve a list of all comics in the database.
 *       Requires the 'comics:list' permission.
 *     tags:
 *       - Comics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of comics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   author:
 *                     type: string
 *                   description:
 *                     type: string
 *                   imageUrl:
 *                     type: string
 *                   pages:
 *                     type: integer
 *                   publisher:
 *                     type: string
 *                   publishedDate:
 *                     type: string
 *                     format: date
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions (requires 'comics:list')
 *       500:
 *         description: Server error
 */
router.get(
  '/',
  authenticateJWT,
  ...authorize(['comics:list']),
  async (req: Request, res: Response) => {
    try {
      logger.info('Fetching all comics');
      const comics = await Comic.findAll();
      res.json(comics);
    } catch (error) {
      logger.error('Error fetching comics: %o', error);
      res.status(500).json({ error: 'Failed to fetch comics' });
    }
  }
);

/**
 * @swagger
 * /comics/{id}:
 *   get:
 *     summary: Get a comic by ID
 *     description: |
 *       Retrieve a specific comic by its ID.
 *       Requires the 'comics:read' permission.
 *     tags:
 *       - Comics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The comic ID
 *     responses:
 *       200:
 *         description: Comic retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 author:
 *                   type: string
 *                 description:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *                 pages:
 *                   type: integer
 *                 publisher:
 *                   type: string
 *                 publishedDate:
 *                   type: string
 *                   format: date
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions (requires 'comics:read')
 *       404:
 *         description: Comic not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id',
  authenticateJWT,
  ...authorize(['comics:read']),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      logger.info(`Fetching comic with id: ${id}`);
      const comic = await Comic.findByPk(id);

      if (!comic) {
        return res.status(404).json({ error: 'Comic not found' });
      }

      res.json(comic);
    } catch (error) {
      logger.error('Error fetching comic: %o', error);
      res.status(500).json({ error: 'Failed to fetch comic' });
    }
  }
);

/**
 * @swagger
 * /comics:
 *   post:
 *     summary: Create a new comic
 *     description: |
 *       Add a new comic to the database.
 *       Requires the 'comics:write' permission.
 *     tags:
 *       - Comics
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               pages:
 *                 type: integer
 *               publisher:
 *                 type: string
 *               publishedDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Comic created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions (requires 'comics:write')
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  authenticateJWT,
  ...authorize(['comics:write']),
  async (req: Request, res: Response) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { title, authorId, description, imageUrl, pages, publisherId, publishedDate } =
        req.body;

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      logger.info(`Creating new comic: ${title as string}`);
      const comic = await Comic.create({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        title,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        authorId,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        description,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        imageUrl,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        pages,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        publisherId,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        publishedDate,
      });

      res.status(201).json(comic);
    } catch (error) {
      logger.error('Error creating comic: %o', error);
      res.status(500).json({ error: 'Failed to create comic' });
    }
  }
);

/**
 * @swagger
 * /comics/{id}:
 *   put:
 *     summary: Update a comic
 *     description: |
 *       Update an existing comic by ID.
 *       Requires the 'comics:update' permission.
 *     tags:
 *       - Comics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The comic ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               pages:
 *                 type: integer
 *               publisher:
 *                 type: string
 *               publishedDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Comic updated successfully
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions (requires 'comics:update')
 *       404:
 *         description: Comic not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id',
  authenticateJWT,
  ...authorize(['comics:update']),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { title, authorId, description, imageUrl, pages, publisherId, publishedDate } =
        req.body;

      logger.info(`Updating comic with id: ${id}`);
      const comic = await Comic.findByPk(id);

      if (!comic) {
        return res.status(404).json({ error: 'Comic not found' });
      }

      await comic.update({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        title,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        authorId,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        description,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        imageUrl,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        pages,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        publisherId,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        publishedDate,
      });

      res.json(comic);
    } catch (error) {
      logger.error('Error updating comic: %o', error);
      res.status(500).json({ error: 'Failed to update comic' });
    }
  }
);

/**
 * @swagger
 * /comics/{id}:
 *   delete:
 *     summary: Delete a comic
 *     description: |
 *       Delete a comic by ID.
 *       Requires the 'comics:delete' permission.
 *     tags:
 *       - Comics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The comic ID
 *     responses:
 *       200:
 *         description: Comic deleted successfully
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions (requires 'comics:delete')
 *       404:
 *         description: Comic not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id',
  authenticateJWT,
  ...authorize(['comics:delete']),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      logger.info(`Deleting comic with id: ${id}`);
      const comic = await Comic.findByPk(id);

      if (!comic) {
        return res.status(404).json({ error: 'Comic not found' });
      }

      await comic.destroy();
      res.json({ message: 'Comic deleted successfully' });
    } catch (error) {
      logger.error('Error deleting comic: %o', error);
      res.status(500).json({ error: 'Failed to delete comic' });
    }
  }
);

export default router;
