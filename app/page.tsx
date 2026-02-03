"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [isDark, setIsDark] = useState(false);

  const [task, setTask] = useState("");
  const [dateTime, setDateTime] = useState("");

  const [taskList, setTaskList] = useState<any[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // ---------- DARK MODE STORAGE ----------
  useEffect(() => {
    const saved = localStorage.getItem("isDark");
    if (saved) setIsDark(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("isDark", JSON.stringify(isDark));
  }, [isDark]);

  // ---------- TASK STORAGE ----------
  useEffect(() => {
    const savedTasks = localStorage.getItem("taskList");

    if (savedTasks) {
      const parsed = JSON.parse(savedTasks);

      const normalized = parsed.map((t: any) => ({
        ...t,
        completed: t.completed ?? false,
      }));

      setTaskList(normalized);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("taskList", JSON.stringify(taskList));
  }, [taskList]);

  // ---------- ADD ----------
  function handleAddTask(e: any) {
    e.preventDefault();

    if (!task || !dateTime) {
      alert("Enter both fields");
      return;
    }

    setTaskList((prev) => [...prev, { task, dateTime, completed: false }]);

    setTask("");
    setDateTime("");
  }

  // ---------- REMOVE ----------
  function handleRemoveTask(index: number) {
    setTaskList((prev) => prev.filter((_, i) => i !== index));
  }

  // ---------- EDIT ----------
  function handleEditTask(index: number) {
    const selected = taskList[index];

    setTask(selected.task);
    setDateTime(selected.dateTime);

    setIsEditing(true);
    setEditIndex(index);
  }

  // ---------- UPDATE ----------
  function handleUpdateTask(e: any) {
    e.preventDefault();

    if (editIndex === null) return;

    const updated = [...taskList];

    updated[editIndex] = {
      ...updated[editIndex],
      task,
      dateTime,
    };

    setTaskList(updated);

    setIsEditing(false);
    setEditIndex(null);

    setTask("");
    setDateTime("");
  }

  // ---------- TOGGLE COMPLETE ----------
  function handleToggleComplete(index: number) {
    const updated = [...taskList];

    updated[index] = {
      ...updated[index],
      completed: !updated[index].completed,
    };

    setTaskList(updated);
  }

  // ---------- FILTER + SEARCH ----------
  const filteredTasks = taskList.filter((item) => {
    const matchesSearch = item.task
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "all"
        ? true
        : filter === "completed"
          ? item.completed
          : !item.completed;

    return matchesSearch && matchesFilter;
  });

  return (
    <div
      className={`min-h-screen w-full font-sans ${
        isDark ? "bg-gray-300" : "bg-white"
      }`}
    >
      {/* DARK TOGGLE */}
      <div className="max-w-7xl mx-auto p-4">
        <button
          onClick={() => setIsDark((p) => !p)}
          className={`text-white px-6 py-3 rounded ${
            isDark ? "bg-blue-500" : "bg-black"
          }`}
        >
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <div className="max-w-7xl mx-auto text-center mt-8 border border-purple-500 p-8 rounded-xl">
        <h1
          className={`text-4xl mb-6 ${
            isDark ? "text-blue-500" : "text-gray-700"
          }`}
        >
          Smart Task Planner
        </h1>

        {/* FORM */}
        <form
          onSubmit={isEditing ? handleUpdateTask : handleAddTask}
          className="space-y-4"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search task..."
            className="w-full border rounded-xl p-4"
          />

          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter task..."
            className="w-full border rounded-xl p-4"
          />

          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="w-full border rounded-xl p-4"
          />

          <button
            type="submit"
            className={`text-white px-6 py-3 rounded ${
              isDark ? "bg-blue-500" : "bg-black"
            }`}
          >
            {isEditing ? "Update Task" : "Add Task"}
          </button>
        </form>

        {/* FILTER BUTTONS */}
        <div className="flex justify-center gap-5 mt-8">
          {["all", "completed", "pending"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded text-white ${
                filter === f
                  ? "bg-green-600"
                  : isDark
                    ? "bg-blue-500"
                    : "bg-black"
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* LIST */}
        <ul className="mt-8 space-y-4">
          {filteredTasks.map((item, index) => (
            <li
              key={index}
              className={`flex gap-6 items-center p-4 border rounded transition-all ${
                item.completed ? "line-through text-gray-400 opacity-70" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => handleToggleComplete(index)}
              />

              <span className="flex-1">
                <strong>{item.task}</strong>
              </span>

              <span>{item.dateTime}</span>

              <button
                onClick={() => handleEditTask(index)}
                className="bg-purple-500 text-white px-3 py-2 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleRemoveTask(index)}
                className="bg-red-500 text-white px-3 py-2 rounded"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        
      </div>
    </div>

    {/* FOOTER */}
      <footer className="bg-blue-300 p-20 mt-20 text-white font-bold text-center text-xl">
        © 2026 Kajal Kotak. All rights reserved.
      </footer>
    </>
  );
}

