import express from "express";
import dotenv from "dotenv";
import "./src/config/db.js";
import routes from "./src/routes/notificationRoutes.js";
import cron from "node-cron";
import { Notification } from "./src/models/notificationModel.js";
import bodyParser from "body-parser";
import path from "path"
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors'
import notifiroute from "./src/routes/index.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json())
const PORT = process.env.notification_service_url || 3005;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname,"client")))


app.use("/api", routes);
app.use("/api/notification",notifiroute)
cron.schedule("0 0 * * *", async () => {
  try {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - 30);

    const result = await Notification.deleteMany({
      isRead: true,
      createdAt: { $lt: dateThreshold },
    });

    if (result.deletedCount > 0) {
      console.log(` ${result.deletedCount} old read notifications deleted`);
    }
  } catch (err) {
    console.error("Cron job error:", err);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


















