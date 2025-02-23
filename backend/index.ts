import cors from "cors";
import express from "express";
import * as dotenv from "dotenv";
import { Client } from "pg";

const app = express();
app.use(cors());
dotenv.config();
app.use(express.json());

const client = new Client({
  connectionString: process.env.PGURI,
});
const port = process.env.PORT || 3001;
client.connect();

app.get("/", (_req, res) => {
  res.send("Hej!");
});

app.get("/api", async (_req, res) => {
  const { rows } = await client.query("SELECT * FROM jokes WHERE id = $1", [1]);

  res.send(rows);
});

app.listen(3001, () => {
  console.log("I am very open");
});
