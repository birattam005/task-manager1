import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState(null);

  const API = "http://localhost:5000/tasks";

  // Load tasks
  const getTasks = async () => {
    try {
      const res = await axios.get(API);
      setTasks(res.data);
    } catch (err) {
      console.log("Backend failed, using local data");
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("tasks");

    if (saved) {
      setTasks(JSON.parse(saved));
    }

    getTasks(); 
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add or Edit task
  const addTask = async () => {
    if (!title) return alert("Enter task");

    // check if task still exists
    const taskExists = tasks.find(t => t.id === editId);

    if (editId && !taskExists) {
      alert("Task was deleted!");
      setEditId(null);
      setTitle("");
      return;
    }

    if (editId) {
      await axios.patch(`${API}/${editId}`, { title });
      setEditId(null);
    } else {
      await axios.post(API, { title });
    }

    setTitle("");
    getTasks();
  };

  // Toggle complete
  const toggleTask = async (id) => {
    await axios.patch(`${API}/${id}`);
    getTasks();
  };

  // Delete
  const deleteTask = async (id) => {
    await axios.delete(`${API}/${id}`);

    // if deleting same task being edited
    if (id === editId) {
      setEditId(null);
      setTitle("");
    }

    getTasks();
  };

  // Edit
  const editTask = (task) => {
    setTitle(task.title);
    setEditId(task.id);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <div className="container">
      <h1>🚀 Task Manager</h1>

      <div className="inputBox">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your task..."
        />
        <button onClick={addTask}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* FILTER BUTTONS */}
      <div className="filters">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
      </div>

      <div className="taskList">
        {filteredTasks.map((task) => (
          <div className="card" key={task.id}>
            <div className="left">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />

              <div>
                <h3 className={task.completed ? "done" : ""}>
                  {task.title}
                </h3>

                <span className={task.completed ? "badge doneBadge" : "badge"}>
                  {task.completed ? "Completed" : "Pending"}
                </span>
              </div>
            </div>

            <div>
              <button onClick={() => editTask(task)}>✏️</button>
              <button className="delete" onClick={() => deleteTask(task.id)}>
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;