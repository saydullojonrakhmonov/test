import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API working" });
});

app.post("/sum", (req, res) => {
  const { a, b } = req.body;
  res.json({ result: a + b });
});

export default app;
