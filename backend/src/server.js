import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db.js";

const start = async () => {
  await connectDB();

  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
  });
};

start();
