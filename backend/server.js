const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

let tasks = [];
let id = 1;

// GET all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// POST create task
app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const newTask = {
    id: id++,
    title,
    completed: false,
    createdAt: new Date(),
  };

  tasks.push(newTask);
  res.json(newTask);
});

// PATCH update task
app.patch("/tasks/:id", (req, res) => {
  const task = tasks.find(t => t.id == req.params.id);

  // ✅ FIX 3 goes here
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  if (req.body && req.body.title !== undefined) {
    task.title = req.body.title;
  } else {
    task.completed = !task.completed;
  }

  res.json(task);
});

// DELETE task
app.delete("/tasks/:id", (req, res) => {
  tasks = tasks.filter(t => t.id != req.params.id);
  res.json({ message: "Deleted" });
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});