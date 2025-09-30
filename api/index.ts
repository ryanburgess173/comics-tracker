import express from 'express';
import sequelize from './db';
import logger from './utils/logger';
import authRouter from './controllers/auth';

const app: express.Application = express();
const port: number = 3000;

sequelize.sync().then(() => {
    logger.info('Database synced');
}).catch((err: Error) => {
    logger.error('Error syncing database: %o', err);
});

app.get('/', (req: express.Request, res: express.Response) => {
    logger.info('Root endpoint accessed');
    res.json({ status: 'API is running' });
});

app.use('/auth', authRouter);

app.listen(port, () => {
    logger.info(`Server is running at http://localhost:${port}`);
});