import { Router, Request, Response } from 'express';
import Omnibus from '../models/Omnibus';
import logger from '../utils/logger';

const router = Router();

/**
 * @swagger
 * /omnibus:
 *   get:
 *     summary: Get all omnibus editions
 *     description: Retrieve a list of all omnibus editions in the database
 *     tags:
 *       - Omnibus
 *     responses:
 *       200:
 *         description: List of omnibus editions retrieved successfully
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
 *                   coverImageUrl:
 *                     type: string
 *                   publicationDate:
 *                     type: string
 *                     format: date
 *                   isbn:
 *                     type: string
 *                   description:
 *                     type: string
 *                   pageCount:
 *                     type: integer
 *                   publisher:
 *                     type: string
 *                   volume:
 *                     type: integer
 *       500:
 *         description: Server error
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    logger.info('Fetching all omnibus editions');
    const omnibus = await Omnibus.findAll();
    res.json(omnibus);
  } catch (error) {
    logger.error('Error fetching omnibus editions: %o', error);
    res.status(500).json({ error: 'Failed to fetch omnibus editions' });
  }
});

/**
 * @swagger
 * /omnibus/{id}:
 *   get:
 *     summary: Get an omnibus edition by ID
 *     description: Retrieve a specific omnibus edition by its ID
 *     tags:
 *       - Omnibus
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The omnibus ID
 *     responses:
 *       200:
 *         description: Omnibus edition retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 coverImageUrl:
 *                   type: string
 *                 publicationDate:
 *                   type: string
 *                   format: date
 *                 isbn:
 *                   type: string
 *                 description:
 *                   type: string
 *                 pageCount:
 *                   type: integer
 *                 publisher:
 *                   type: string
 *                 volume:
 *                   type: integer
 *       404:
 *         description: Omnibus edition not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching omnibus edition with id: ${id}`);
    const omnibus = await Omnibus.findByPk(id);

    if (!omnibus) {
      return res.status(404).json({ error: 'Omnibus edition not found' });
    }

    res.json(omnibus);
  } catch (error) {
    logger.error('Error fetching omnibus edition: %o', error);
    res.status(500).json({ error: 'Failed to fetch omnibus edition' });
  }
});

/**
 * @swagger
 * /omnibus:
 *   post:
 *     summary: Create a new omnibus edition
 *     description: Add a new omnibus edition to the database
 *     tags:
 *       - Omnibus
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               coverImageUrl:
 *                 type: string
 *               publicationDate:
 *                 type: string
 *                 format: date
 *               isbn:
 *                 type: string
 *               description:
 *                 type: string
 *               pageCount:
 *                 type: integer
 *               publisher:
 *                 type: string
 *               volume:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Omnibus edition created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const {
      title,
      coverImageUrl,
      publicationDate,
      isbn,
      description,
      pageCount,
      publisher,
      volume,
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    logger.info(`Creating new omnibus edition: ${title as string}`);
    const omnibus = await Omnibus.create({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      title,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      coverImageUrl,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      publicationDate,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      isbn,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      description,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      pageCount,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      publisher,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      volume,
    });

    res.status(201).json(omnibus);
  } catch (error) {
    logger.error('Error creating omnibus edition: %o', error);
    res.status(500).json({ error: 'Failed to create omnibus edition' });
  }
});

/**
 * @swagger
 * /omnibus/{id}:
 *   put:
 *     summary: Update an omnibus edition
 *     description: Update an existing omnibus edition by ID
 *     tags:
 *       - Omnibus
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The omnibus ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               coverImageUrl:
 *                 type: string
 *               publicationDate:
 *                 type: string
 *                 format: date
 *               isbn:
 *                 type: string
 *               description:
 *                 type: string
 *               pageCount:
 *                 type: integer
 *               publisher:
 *                 type: string
 *               volume:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Omnibus edition updated successfully
 *       404:
 *         description: Omnibus edition not found
 *       500:
 *         description: Server error
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const {
      title,
      coverImageUrl,
      publicationDate,
      isbn,
      description,
      pageCount,
      publisher,
      volume,
    } = req.body;

    logger.info(`Updating omnibus edition with id: ${id}`);
    const omnibus = await Omnibus.findByPk(id);

    if (!omnibus) {
      return res.status(404).json({ error: 'Omnibus edition not found' });
    }

    await omnibus.update({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      title,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      coverImageUrl,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      publicationDate,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      isbn,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      description,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      pageCount,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      publisher,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      volume,
    });

    res.json(omnibus);
  } catch (error) {
    logger.error('Error updating omnibus edition: %o', error);
    res.status(500).json({ error: 'Failed to update omnibus edition' });
  }
});

/**
 * @swagger
 * /omnibus/{id}:
 *   delete:
 *     summary: Delete an omnibus edition
 *     description: Delete an omnibus edition by ID
 *     tags:
 *       - Omnibus
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The omnibus ID
 *     responses:
 *       200:
 *         description: Omnibus edition deleted successfully
 *       404:
 *         description: Omnibus edition not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    logger.info(`Deleting omnibus edition with id: ${id}`);
    const omnibus = await Omnibus.findByPk(id);

    if (!omnibus) {
      return res.status(404).json({ error: 'Omnibus edition not found' });
    }

    await omnibus.destroy();
    res.json({ message: 'Omnibus edition deleted successfully' });
  } catch (error) {
    logger.error('Error deleting omnibus edition: %o', error);
    res.status(500).json({ error: 'Failed to delete omnibus edition' });
  }
});

export default router;
