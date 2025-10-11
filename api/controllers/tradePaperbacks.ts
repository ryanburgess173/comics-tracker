import { Router, Request, Response } from 'express';
import TradePaperback from '../models/TradePaperback';
import logger from '../utils/logger';

const router = Router();

/**
 * @swagger
 * /trade-paperbacks:
 *   get:
 *     summary: Get all trade paperbacks
 *     description: Retrieve a list of all trade paperbacks in the database
 *     tags:
 *       - Trade Paperbacks
 *     responses:
 *       200:
 *         description: List of trade paperbacks retrieved successfully
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
    logger.info('Fetching all trade paperbacks');
    const tradePaperbacks = await TradePaperback.findAll();
    res.json(tradePaperbacks);
  } catch (error) {
    logger.error('Error fetching trade paperbacks: %o', error);
    res.status(500).json({ error: 'Failed to fetch trade paperbacks' });
  }
});

/**
 * @swagger
 * /trade-paperbacks/{id}:
 *   get:
 *     summary: Get a trade paperback by ID
 *     description: Retrieve a specific trade paperback by its ID
 *     tags:
 *       - Trade Paperbacks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The trade paperback ID
 *     responses:
 *       200:
 *         description: Trade paperback retrieved successfully
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
 *         description: Trade paperback not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching trade paperback with id: ${id}`);
    const tradePaperback = await TradePaperback.findByPk(id);
    
    if (!tradePaperback) {
      return res.status(404).json({ error: 'Trade paperback not found' });
    }
    
    res.json(tradePaperback);
  } catch (error) {
    logger.error('Error fetching trade paperback: %o', error);
    res.status(500).json({ error: 'Failed to fetch trade paperback' });
  }
});

/**
 * @swagger
 * /trade-paperbacks:
 *   post:
 *     summary: Create a new trade paperback
 *     description: Add a new trade paperback to the database
 *     tags:
 *       - Trade Paperbacks
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
 *         description: Trade paperback created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', async (req: Request, res: Response) => {
  try {
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
    
    logger.info(`Creating new trade paperback: ${title}`);
    const tradePaperback = await TradePaperback.create({
      title,
      coverImageUrl,
      publicationDate,
      isbn,
      description,
      pageCount,
      publisher,
      volume,
    });
    
    res.status(201).json(tradePaperback);
  } catch (error) {
    logger.error('Error creating trade paperback: %o', error);
    res.status(500).json({ error: 'Failed to create trade paperback' });
  }
});

/**
 * @swagger
 * /trade-paperbacks/{id}:
 *   put:
 *     summary: Update a trade paperback
 *     description: Update an existing trade paperback by ID
 *     tags:
 *       - Trade Paperbacks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The trade paperback ID
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
 *         description: Trade paperback updated successfully
 *       404:
 *         description: Trade paperback not found
 *       500:
 *         description: Server error
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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
    
    logger.info(`Updating trade paperback with id: ${id}`);
    const tradePaperback = await TradePaperback.findByPk(id);
    
    if (!tradePaperback) {
      return res.status(404).json({ error: 'Trade paperback not found' });
    }
    
    await tradePaperback.update({
      title,
      coverImageUrl,
      publicationDate,
      isbn,
      description,
      pageCount,
      publisher,
      volume,
    });
    
    res.json(tradePaperback);
  } catch (error) {
    logger.error('Error updating trade paperback: %o', error);
    res.status(500).json({ error: 'Failed to update trade paperback' });
  }
});

/**
 * @swagger
 * /trade-paperbacks/{id}:
 *   delete:
 *     summary: Delete a trade paperback
 *     description: Delete a trade paperback by ID
 *     tags:
 *       - Trade Paperbacks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The trade paperback ID
 *     responses:
 *       200:
 *         description: Trade paperback deleted successfully
 *       404:
 *         description: Trade paperback not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    logger.info(`Deleting trade paperback with id: ${id}`);
    const tradePaperback = await TradePaperback.findByPk(id);
    
    if (!tradePaperback) {
      return res.status(404).json({ error: 'Trade paperback not found' });
    }
    
    await tradePaperback.destroy();
    res.json({ message: 'Trade paperback deleted successfully' });
  } catch (error) {
    logger.error('Error deleting trade paperback: %o', error);
    res.status(500).json({ error: 'Failed to delete trade paperback' });
  }
});

export default router;
