import { Router, Request, Response } from 'express';
import Comic from '../models/Comic';
import UserComicXRef from '../models/UserComicXRef';
import logger from '../utils/logger';
import { authenticateJWT } from '../middleware/authenticateJWT';
import { authorize } from '../middleware/checkPermissions';
import sequelize from '../db';
import { QueryTypes } from 'sequelize';

const router = Router();

/**
 * @swagger
 * /comics/my-comics:
 *   get:
 *     summary: Get authenticated user's comics
 *     description: |
 *       Retrieve all comics that the authenticated user owns.
 *       Returns comics where the user has an entry in UserComicXRef with dateAdded set.
 *       This endpoint requires authentication but no specific permissions.
 *     tags:
 *       - Comics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [WISHLIST, OWNED, READING, READ]
 *         description: Filter by comic status (optional)
 *     responses:
 *       200:
 *         description: List of user's comics retrieved successfully
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
 *                   userComicData:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                         enum: [WISHLIST, OWNED, READING, READ]
 *                       dateAdded:
 *                         type: string
 *                         format: date-time
 *                       dateStartedReading:
 *                         type: string
 *                         format: date-time
 *                       dateFinished:
 *                         type: string
 *                         format: date-time
 *                       rating:
 *                         type: integer
 *                         minimum: 1
 *                         maximum: 5
 *                       notes:
 *                         type: string
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Server error
 */
router.get('/my-comics', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { status } = req.query;

    // Build where clause
    const whereClause: { userId: number; status?: string } = { userId };
    if (status && typeof status === 'string') {
      whereClause.status = status;
    }

    const statusStr = status && typeof status === 'string' ? ` with status: ${status}` : '';
    logger.info(`Fetching comics for user ${userId}${statusStr}`);

    // Get user's comics with their relationship data
    const userComics = await UserComicXRef.findAll({
      where: whereClause,
      include: [
        {
          model: Comic,
          as: 'comic',
        },
      ],
      order: [['dateAdded', 'DESC']],
    });

    // Format response to include both comic data and user relationship data
    const formattedComics = userComics
      .map((userComic) => {
        const comicData = userComic.get('comic');
        if (!comicData) {
          return null;
        }

        // Extract plain object from Sequelize instance
        const plainComicData =
          typeof comicData === 'object' && comicData && 'dataValues' in comicData
            ? (comicData.dataValues as Record<string, unknown>)
            : (comicData as Record<string, unknown>);

        return {
          ...plainComicData,
          userComicData: {
            status: userComic.status,
            dateAdded: userComic.dateAdded,
            dateStartedReading: userComic.dateStartedReading,
            dateFinished: userComic.dateFinished,
            rating: userComic.rating,
            notes: userComic.notes,
          },
        };
      })
      .filter((comic): comic is NonNullable<typeof comic> => comic !== null);

    res.json(formattedComics);
  } catch (error) {
    logger.error('Error fetching user comics: %o', error);
    res.status(500).json({ error: 'Failed to fetch user comics' });
  }
});

/**
 * @swagger
 * /comics/my-comics:
 *   post:
 *     summary: Add a comic to authenticated user's collection
 *     description: |
 *       Add a comic to the authenticated user's collection with a specified status.
 *       This endpoint requires authentication but no specific permissions.
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
 *               - comicId
 *             properties:
 *               comicId:
 *                 type: integer
 *                 description: The ID of the comic to add
 *               status:
 *                 type: string
 *                 enum: [WISHLIST, OWNED, READING, READ]
 *                 default: OWNED
 *                 description: The status of the comic in user's collection
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: User's rating (1-5 stars)
 *               notes:
 *                 type: string
 *                 description: User's personal notes about the comic
 *               dateStartedReading:
 *                 type: string
 *                 format: date-time
 *                 description: Date when user started reading (auto-set if status is READING)
 *               dateFinished:
 *                 type: string
 *                 format: date-time
 *                 description: Date when user finished reading (auto-set if status is READ)
 *     responses:
 *       201:
 *         description: Comic added to user's collection successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 userId:
 *                   type: integer
 *                 comicId:
 *                   type: integer
 *                 status:
 *                   type: string
 *                 dateAdded:
 *                   type: string
 *                   format: date-time
 *                 dateStartedReading:
 *                   type: string
 *                   format: date-time
 *                 dateFinished:
 *                   type: string
 *                   format: date-time
 *                 rating:
 *                   type: integer
 *                 notes:
 *                   type: string
 *       400:
 *         description: Bad request - invalid input or comic already in collection
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Comic not found
 *       500:
 *         description: Server error
 */
router.post('/my-comics', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { comicId, status, rating, notes, dateStartedReading, dateFinished } = req.body;

    if (!comicId) {
      return res.status(400).json({ error: 'comicId is required' });
    }

    // Verify comic exists
    const comic = await Comic.findByPk(comicId as number);
    if (!comic) {
      return res.status(404).json({ error: 'Comic not found' });
    }

    // Check if user already has this comic
    const existing = await UserComicXRef.findOne({
      where: { userId, comicId: comicId as number },
    });

    if (existing) {
      return res.status(400).json({ error: 'Comic already in your collection' });
    }

    // Validate rating if provided
    if (rating !== undefined && rating !== null) {
      const ratingNum = Number(rating);
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }
    }

    logger.info(`Adding comic ${comicId as string} to user ${userId}'s collection`);

    // Prepare data for creation
    const comicStatus = (status as string) || 'OWNED';

    // Validate status
    const validStatuses = ['WISHLIST', 'OWNED', 'READING', 'READ'];
    if (!validStatuses.includes(comicStatus)) {
      return res
        .status(400)
        .json({ error: 'Invalid status. Must be WISHLIST, OWNED, READING, or READ' });
    }

    const userComicData: {
      userId: number;
      comicId: number;
      status: 'WISHLIST' | 'OWNED' | 'READING' | 'READ';
      rating?: number;
      notes?: string;
      dateStartedReading?: Date;
      dateFinished?: Date;
    } = {
      userId,
      comicId: comicId as number,
      status: comicStatus as 'WISHLIST' | 'OWNED' | 'READING' | 'READ',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      rating,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      notes,
    };

    // Auto-set dates based on status if not provided
    if (comicStatus === 'READING' && !dateStartedReading) {
      userComicData.dateStartedReading = new Date();
    } else if (dateStartedReading) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      userComicData.dateStartedReading = new Date(dateStartedReading);
    }

    if (comicStatus === 'READ' && !dateFinished) {
      userComicData.dateFinished = new Date();
    } else if (dateFinished) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      userComicData.dateFinished = new Date(dateFinished);
    }

    // Create the user-comic relationship
    const userComic = await UserComicXRef.create(userComicData);

    res.status(201).json(userComic);
  } catch (error) {
    logger.error('Error adding comic to user collection: %o', error);
    res.status(500).json({ error: 'Failed to add comic to collection' });
  }
});

/**
 * @swagger
 * /comics/recentReleases:
 *   get:
 *     summary: Get recent comic releases
 *     description: |
 *       Retrieve the most recently published comic from each run.
 *       This endpoint does not require authentication.
 *     tags:
 *       - Comics
 *     responses:
 *       200:
 *         description: List of recent comics retrieved successfully (one per run)
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
 *       500:
 *         description: Server error
 */
router.get('/recentReleases', async (req: Request, res: Response) => {
  try {
    // Get the most recent comic for each run
    const comics = await sequelize.query(
      `
        SELECT c.*
        FROM Comics c
        INNER JOIN (
          SELECT runId, MAX(publishedDate) as maxDate
          FROM Comics
          WHERE runId IS NOT NULL
            AND publishedDate >= date('now', '-10 years')
          GROUP BY runId
        ) latest ON c.runId = latest.runId 
                AND c.publishedDate = latest.maxDate
        ORDER BY c.publishedDate DESC
        `,
      {
        type: QueryTypes.SELECT,
        model: Comic,
        mapToModel: true,
      }
    );

    res.json(comics);
  } catch (error) {
    logger.error('Error fetching recent releases: %o', error);
    res.status(500).json({ error: 'Failed to fetch recent releases' });
  }
});

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
