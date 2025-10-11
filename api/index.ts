import 'dotenv/config';
import app from './app';
import logger from './utils/logger';

// app port number for listening
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`);
});
