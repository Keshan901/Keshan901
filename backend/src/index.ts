import cors from "cors";
import express from "express";

import { env } from "./config/env";
import { errorHandler } from "./middleware/error-handler";
import routes from "./routes";

const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true
  })
);
app.use(express.json());

app.use("/api", routes);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`API server running at http://localhost:${env.port}/api`);
});
