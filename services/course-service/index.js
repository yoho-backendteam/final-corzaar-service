import express from "express";
import cors from "cors";
import dotenv from "@dotenvx/dotenvx";
import "./src/config/db.config.js";
import routes from "./src/routes/index.js";

dotenv.config();

const app = express();
const PORT = 3014;

app.use(
  cors()
);

app.use(express.json());

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Course server running on http://localhost:${PORT}`);
});
