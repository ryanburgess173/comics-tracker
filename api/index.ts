import express from 'express';
import sequelize from './db';

import authRouter from './controllers/auth';

const app: express.Application = express();
const port: number = 3000;

sequelize.sync().then(() => {
    console.log('Database synced');
}).catch((err: Error) => {
    console.error('Error syncing database:', err);
});

app.get('/', (req: express.Request, res: express.Response) => {
  res.json({ status: 'API is running' });
});

app.use('/auth', authRouter);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});