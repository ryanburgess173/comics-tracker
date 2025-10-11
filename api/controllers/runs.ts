import { Router, Request, Response } from 'express';
import Run from '../models/Run';
import logger from '../utils/logger';

const router = Router();

/**
 * @swagger
 * /runs:
 *   get:
 *     summary: Get all runs
 *     description: Retrieve a list of all comic runs in the database
 *     tags:
 *       - Runs
 *     responses:
 *       200:
 *         description: List of runs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   seriesName:
 *                     type: string
 *                   keyAuthorId:
 *                     type: integer
 *                   keyArtistId:
 *                     type: integer
 *                   startDate:
 *                     type: string
 *                     format: date
 *                   endDate:
 *                     type: string
 *                     format: date
 *                   startIssue:
 *                     type: integer
 *                   endIssue:
 *                     type: integer
 *                   description:
 *                     type: string
 *                   universeId:
 *                     type: integer
 *       500:
 *         description: Server error
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    logger.info('Fetching all runs');
    const runs = await Run.findAll();
    res.json(runs);
  } catch (error) {
    logger.error('Error fetching runs: %o', error);
    res.status(500).json({ error: 'Failed to fetch runs' });
  }
});

/**
 * @swagger
 * /runs/{id}:
 *   get:
 *     summary: Get a run by ID
 *     description: Retrieve a specific comic run by its ID
 *     tags:
 *       - Runs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The run ID
 *     responses:
 *       200:
 *         description: Run retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 seriesName:
 *                   type: string
 *                 keyAuthorId:
 *                   type: integer
 *                 keyArtistId:
 *                   type: integer
 *                 startDate:
 *                   type: string
 *                   format: date
 *                 endDate:
 *                   type: string
 *                   format: date
 *                 startIssue:
 *                   type: integer
 *                 endIssue:
 *                   type: integer
 *                 description:
 *                   type: string
 *                 universeId:
 *                   type: integer
 *       404:
 *         description: Run not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching run with id: ${id}`);
    const run = await Run.findByPk(id);
    
    if (!run) {
      return res.status(404).json({ error: 'Run not found' });
    }
    
    res.json(run);
  } catch (error) {
    logger.error('Error fetching run: %o', error);
    res.status(500).json({ error: 'Failed to fetch run' });
  }
});

/**
 * @swagger
 * /runs:
 *   post:
 *     summary: Create a new run
 *     description: Add a new comic run to the database
 *     tags:
 *       - Runs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - seriesName
 *             properties:
 *               seriesName:
 *                 type: string
 *               keyAuthorId:
 *                 type: integer
 *               keyArtistId:
 *                 type: integer
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               startIssue:
 *                 type: integer
 *               endIssue:
 *                 type: integer
 *               description:
 *                 type: string
 *               universeId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Run created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      seriesName,
      keyAuthorId,
      keyArtistId,
      startDate,
      endDate,
      startIssue,
      endIssue,
      description,
      universeId,
    } = req.body;
    
    if (!seriesName) {
      return res.status(400).json({ error: 'Series name is required' });
    }
    
    logger.info(`Creating new run: ${seriesName}`);
    const run = await Run.create({
      seriesName,
      keyAuthorId,
      keyArtistId,
      startDate,
      endDate,
      startIssue,
      endIssue,
      description,
      universeId,
    });
    
    res.status(201).json(run);
  } catch (error) {
    logger.error('Error creating run: %o', error);
    res.status(500).json({ error: 'Failed to create run' });
  }
});

/**
 * @swagger
 * /runs/{id}:
 *   put:
 *     summary: Update a run
 *     description: Update an existing comic run by ID
 *     tags:
 *       - Runs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The run ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seriesName:
 *                 type: string
 *               keyAuthorId:
 *                 type: integer
 *               keyArtistId:
 *                 type: integer
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               startIssue:
 *                 type: integer
 *               endIssue:
 *                 type: integer
 *               description:
 *                 type: string
 *               universeId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Run updated successfully
 *       404:
 *         description: Run not found
 *       500:
 *         description: Server error
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      seriesName,
      keyAuthorId,
      keyArtistId,
      startDate,
      endDate,
      startIssue,
      endIssue,
      description,
      universeId,
    } = req.body;
    
    logger.info(`Updating run with id: ${id}`);
    const run = await Run.findByPk(id);
    
    if (!run) {
      return res.status(404).json({ error: 'Run not found' });
    }
    
    await run.update({
      seriesName,
      keyAuthorId,
      keyArtistId,
      startDate,
      endDate,
      startIssue,
      endIssue,
      description,
      universeId,
    });
    
    res.json(run);
  } catch (error) {
    logger.error('Error updating run: %o', error);
    res.status(500).json({ error: 'Failed to update run' });
  }
});

/**
 * @swagger
 * /runs/{id}:
 *   delete:
 *     summary: Delete a run
 *     description: Delete a comic run by ID
 *     tags:
 *       - Runs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The run ID
 *     responses:
 *       200:
 *         description: Run deleted successfully
 *       404:
 *         description: Run not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    logger.info(`Deleting run with id: ${id}`);
    const run = await Run.findByPk(id);
    
    if (!run) {
      return res.status(404).json({ error: 'Run not found' });
    }
    
    await run.destroy();
    res.json({ message: 'Run deleted successfully' });
  } catch (error) {
    logger.error('Error deleting run: %o', error);
    res.status(500).json({ error: 'Failed to delete run' });
  }
});

export default router;
