import "dotenv/config";
import express from "express";
import swaggerUi from "swagger-ui-express";
import sequelize from "./db";
import logger from "./utils/logger";
import authRouter from "./controllers/auth";
import swaggerSpec from "./swagger";

const app: express.Application = express();

// add middleware to parse JSON request bodies
app.use(express.json());

// Swagger UI setup
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Comics Tracker API Docs",
  })
);

// sync database (only in non-test environment)
if (process.env.NODE_ENV !== "test") {
  sequelize
    .sync()
    .then(() => {
      logger.info("Database synced");
    })
    .catch((err: Error) => {
      logger.error("Error syncing database: %o", err);
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
app.get("/", (req: express.Request, res: express.Response) => {
  logger.info("Root endpoint accessed");
  res.json({ status: "API is running" });
});

app.use("/auth", authRouter);

export default app;
