import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa"; // Asegúrate de instalar react-icons

const API_URL = "https://playground.4geeks.com/todo/user/alesanchezr";

export const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState("");

  const getTasks = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
    }
  };

  const syncTasks = async (updatedTasks) => {
    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        body: JSON.stringify(updatedTasks),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      console.log("Sincronización exitosa:", data);
    } catch (error) {
      console.error("Error al sincronizar tareas:", error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (newTaskName.trim()) {
      const newTask = { label: newTaskName, done: false };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      await syncTasks(updatedTasks);
      setNewTaskName("");
    }
  };

  const handleInputChange = (e) => {
    setNewTaskName(e.target.value);
  };

  const deleteTask = async (taskIndex) => {
    const updatedTasks = tasks.filter((_, index) => index !== taskIndex);
    setTasks(updatedTasks);
    await syncTasks(updatedTasks);
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div style={{ width: "90%", maxWidth: "600px", margin: "0 auto", padding: "20px", background: "#1a1a1a", color: "#f5f5f5", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Todo List</h2>
      <form onSubmit={addTask} style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <input
          type="text"
          value={newTaskName}
          onChange={handleInputChange}
          placeholder="New task name"
          style={{ width: "80%", padding: "10px", border: "none", borderRadius: "4px", marginRight: "10px" }}
        />
        <button type="submit" style={{ background: "#28a745", color: "white", padding: "10px 20px", border: "none", borderRadius: "4px", cursor: "pointer" }}>Add Task</button>
      </form>
      <ul style={{ listStyle: "none", padding: "0" }}>
        {tasks.map((task, index) => (
          <li key={index} style={{ background: "#333", padding: "10px", marginBottom: "10px", borderRadius: "4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {task.label}
            <button onClick={() => deleteTask(index)} style={{ background: "none", border: "none", color: "#dc3545", cursor: "pointer" }}>
              <FaTrash size={20} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
