import express from "express";
import { config } from "./config/dotenv";
import agentRoutes from "./routes/agent.routes";
import logsRoutes from "./routes/logs.routes";
import { contextMiddleware } from "./middlewares/context";

config();

const app = express();

app.use(contextMiddleware);

app.use(express.json());

app.use("/agent", agentRoutes);
app.use("/logs", logsRoutes);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`Agent server running on port ${PORT}`);
});
