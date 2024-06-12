import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pg from "pg";
import bcrypt from "bcrypt";

const app = express();
const saltRounds = 10;

const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "todo",
  password: "12345",
  port: "5432",
});

app.use(bodyParser.json());
app.use(cors());

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(hashedPassword);
    const result = await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *",
      [username, hashedPassword]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    const user = result.rows[0];
    console.log(user);
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/todos/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const result = await pool.query("SELECT * FROM tasks WHERE username = $1", [
      username,
    ]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/todos", async (req, res) => {
  const { title, description, due_date, completed, username } = req.body;
  console.log(username);
  try {
    const result = await pool.query(
      "INSERT INTO tasks (title, description, due_date, completed, username) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, description, due_date, completed, username]
    );
    console.log(result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error.message);
  }
});
app.put("/todosCompleted/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE tasks SET completed = true WHERE task_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM pola WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, due_date } = req.body;
  console.log("PUT AND EDIT TODO", title, description, due_date, id);

  try {
    const result = await pool.query(
      "UPDATE tasks SET title = $1, description = $2, due_date = $3, completed = $4 WHERE task_id = $5 RETURNING *",
      [title, description, due_date, completed, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM tasks WHERE task_id = $1", [id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/search/:query", async (req, res) => {
  const { query } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM tasks WHERE title ILIKE '%' || $1 || '%'",
      [query]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(8000, () => {
  console.log("Server is listening on port 8000");
});
