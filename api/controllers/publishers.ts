import { Router, Request, Response } from 'express';
import Publisher from '../models/Publisher';
import logger from '../utils/logger';

const router = Router();

/**
 * @swagger
 * /publishers:
 *   get:
 *     summary: Get all publishers
 *     description: Retrieve a list of all publishers in the database
 *     tags:
 *       - Publishers
 *     responses:
 *       200:
 *         description: List of publishers retrieved successfully
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
 *                   country:
 *                     type: string
 *                   foundedYear:
 *                     type: integer
 *                   website:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    logger.info('Fetching all publishers');
    const publishers = await Publisher.findAll();
    res.json(publishers);
  } catch (error) {
    logger.error('Error fetching publishers: %o', error);
    res.status(500).json({ error: 'Failed to fetch publishers' });
  }
});

/**
 * @swagger
 * /publishers/{id}:
 *   get:
 *     summary: Get a publisher by ID
 *     description: Retrieve a specific publisher by its ID
 *     tags:
 *       - Publishers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The publisher ID
 *     responses:
 *       200:
 *         description: Publisher retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 country:
 *                   type: string
 *                 foundedYear:
 *                   type: integer
 *                 website:
 *                   type: string
 *       404:
 *         description: Publisher not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching publisher with id: ${id}`);
    const publisher = await Publisher.findByPk(id);

    if (!publisher) {
      return res.status(404).json({ error: 'Publisher not found' });
    }

    res.json(publisher);
  } catch (error) {
    logger.error('Error fetching publisher: %o', error);
    res.status(500).json({ error: 'Failed to fetch publisher' });
  }
});

/**
 * @swagger
 * /publishers:
 *   post:
 *     summary: Create a new publisher
 *     description: Add a new publisher to the database
 *     tags:
 *       - Publishers
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
 *               country:
 *                 type: string
 *               foundedYear:
 *                 type: integer
 *               website:
 *                 type: string
 *     responses:
 *       201:
 *         description: Publisher created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { name, country, foundedYear, website } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    logger.info(`Creating new publisher: ${name as string}`);
    const publisher = await Publisher.create({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      name,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      country,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      foundedYear,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      website,
    });

    res.status(201).json(publisher);
  } catch (error) {
    logger.error('Error creating publisher: %o', error);
    res.status(500).json({ error: 'Failed to create publisher' });
  }
});

/**
 * @swagger
 * /publishers/{id}:
 *   put:
 *     summary: Update a publisher
 *     description: Update an existing publisher by ID
 *     tags:
 *       - Publishers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The publisher ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               country:
 *                 type: string
 *               foundedYear:
 *                 type: integer
 *               website:
 *                 type: string
 *     responses:
 *       200:
 *         description: Publisher updated successfully
 *       404:
 *         description: Publisher not found
 *       500:
 *         description: Server error
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { name, country, foundedYear, website } = req.body;

    logger.info(`Updating publisher with id: ${id}`);
    const publisher = await Publisher.findByPk(id);

    if (!publisher) {
      return res.status(404).json({ error: 'Publisher not found' });
    }

    await publisher.update({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      name,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      country,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      foundedYear,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      website,
    });

    res.json(publisher);
  } catch (error) {
    logger.error('Error updating publisher: %o', error);
    res.status(500).json({ error: 'Failed to update publisher' });
  }
});

/**
 * @swagger
 * /publishers/{id}:
 *   delete:
 *     summary: Delete a publisher
 *     description: Delete a publisher by ID
 *     tags:
 *       - Publishers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The publisher ID
 *     responses:
 *       200:
 *         description: Publisher deleted successfully
 *       404:
 *         description: Publisher not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    logger.info(`Deleting publisher with id: ${id}`);
    const publisher = await Publisher.findByPk(id);

    if (!publisher) {
      return res.status(404).json({ error: 'Publisher not found' });
    }

    await publisher.destroy();
    res.json({ message: 'Publisher deleted successfully' });
  } catch (error) {
    logger.error('Error deleting publisher: %o', error);
    res.status(500).json({ error: 'Failed to delete publisher' });
  }
});

export default router;
