import express from "express";
import homeRouter from "./routes/home.js";

const app = express();
const PORT = 3000;

app.use("/", homeRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});