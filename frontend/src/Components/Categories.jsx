import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Categories() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    const fetchNotes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/notes", {
          headers: { Authorization: token },
        });
        setNotes(res.data);
      } catch (err) {
        alert("Failed to fetch notes");
      }
    };
    fetchNotes();
  }, [navigate, token]);

  // Extract unique categories (filter out empty or null categories)
  const categories = [
    ...new Set(notes.map((note) => note.category || "No Folder")),
  ];

  // Add note without folder
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote) return;
    try {
      await axios.post(
        "http://localhost:5000/api/notes",
        { content: newNote, category: "" }, // empty category means no folder
        { headers: { Authorization: token } }
      );
      setNewNote("");
      const res = await axios.get("http://localhost:5000/api/notes", {
        headers: { Authorization: token },
      });
      setNotes(res.data);
    } catch (err) {
      alert("Failed to add note");
    }
  };

  return (
    <div>
      <h2>Your Categories</h2>
      <ul>
        {categories.map((cat) => (
          <li
            key={cat}
            style={{ cursor: "pointer", margin: "10px 0", color: "blue" }}
            onClick={() => navigate(`/notes/${cat === "No Folder" ? "" : cat}`)}
          >
            📁 {cat}
          </li>
        ))}
      </ul>

      <hr />

      <h3>Add Note Without Folder</h3>
      <form onSubmit={handleAddNote}>
        <input
          type="text"
          placeholder="Add note heading..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          required
        />
        <button type="submit">Add Note</button>
      </form>
    </div>
  );
}
