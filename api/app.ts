import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import sequelize from './db';
import logger from './utils/logger';
import authRouter from './controllers/auth';
import comicsRouter from './controllers/comics';
import publishersRouter from './controllers/publishers';
import universesRouter from './controllers/universes';
import creatorsRouter from './controllers/creators';
import runsRouter from './controllers/runs';
import omnibusRouter from './controllers/omnibus';
import tradePaperbacksRouter from './controllers/tradePaperbacks';
import swaggerSpec from './swagger';

const app: express.Application = express();

// add middleware to parse JSON request bodies
app.use(express.json());

// Swagger UI setup
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Comics Tracker API Docs',
  })
);

// sync database (only in non-test environment)
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
  sequelize
    .sync({ alter: true })
    .then(() => {
      logger.info('Database synced');
    })
    .catch((err: Error) => {
      logger.error('Error syncing database: %o', err);
    });
}

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the API status
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API is running successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: API is running
 */
app.get('/', (req: express.Request, res: express.Response) => {
  logger.info('Root endpoint accessed');
  res.json({ status: 'API is running' });
});

// Register all routes
app.use('/auth', authRouter);
app.use('/comics', comicsRouter);
app.use('/publishers', publishersRouter);
app.use('/universes', universesRouter);
app.use('/creators', creatorsRouter);
app.use('/runs', runsRouter);
app.use('/omnibus', omnibusRouter);
app.use('/trade-paperbacks', tradePaperbacksRouter);

export default app;
