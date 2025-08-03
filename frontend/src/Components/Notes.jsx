import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Notes.css";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newFolder, setNewFolder] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); //Added for search filtering
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchNotes();
  }, [navigate, token]);

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

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await axios.post(
        "http://localhost:5000/api/notes",
        {
          title: newTitle.trim(),
          content: " ", //  non-empty string
          category: "",
        },
        { headers: { Authorization: token } }
      );
      setNewTitle("");
      fetchNotes();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add note");
    }
  };

  const handleAddFolder = async () => {
    if (!newFolder.trim()) return;
    try {
      await axios.post(
        "http://localhost:5000/api/notes",
        {
          title: "Folder Placeholder",
          content: " ",
          category: newFolder.trim(),
        },
        { headers: { Authorization: token } }
      );
      setNewFolder("");
      fetchNotes();
    } catch (err) {
      alert("Failed to add folder");
    }
  };

  const handleDeleteFolder = async (category) => {
    const confirm = window.confirm(
      `Delete folder "${category}" and its notes?`
    );
    if (!confirm) return;
    try {
      await axios.delete(`http://localhost:5000/api/notes/folder/${category}`, {
        headers: { Authorization: token },
      });
      fetchNotes();
    } catch (err) {
      alert("Failed to delete folder");
    }
  };

  const handleEditFolder = async (oldCategory) => {
    const newCategory = prompt("Enter new folder name:", oldCategory);
    if (!newCategory || newCategory === oldCategory) return;
    try {
      await axios.put(
        `http://localhost:5000/api/notes/folder/${oldCategory}`,
        { newCategory },
        { headers: { Authorization: token } }
      );
      fetchNotes();
    } catch (err) {
      alert("Failed to rename folder");
    }
  };

  const handleDeleteNote = async (id) => {
    const confirm = window.confirm("Delete this note?");
    if (!confirm) return;
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: { Authorization: token },
      });
      fetchNotes();
    } catch (err) {
      alert("Failed to delete note");
    }
  };

  const categories = [
    ...new Set(notes.map((note) => note.category).filter((cat) => cat !== "")),
  ];

  const noFolderNotes = notes.filter((note) => !note.category);

  const filteredNotes = noFolderNotes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="notes-wrapper">
      <div className="sidebar">
        <h2>Folders 📁</h2>
        <ul className="category-list">
          {categories.map((cat) => (
            <li key={cat}>
              <span onClick={() => navigate(`/notes/${cat}`)}>{cat}</span>
              <span className="folder-actions">
                <button onClick={() => handleEditFolder(cat)}>✏️</button>
                <button onClick={() => handleDeleteFolder(cat)}>❌</button>
              </span>
            </li>
          ))}
        </ul>

        <div className="add-folder">
          <input
            type="text"
            placeholder="New Folder Name"
            value={newFolder}
            onChange={(e) => setNewFolder(e.target.value)}
          />
          <button onClick={handleAddFolder}>Add Folder</button>
        </div>
      </div>

      <div className="main-content">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>

        <h1 className="quicknotes-title">QuickNotes</h1>

        {/* ✅ Search Bar */}
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <div className="add-note-card">
          <h3>Add Note Without Folder</h3>
          <form onSubmit={handleAddNote}>
            <input
              type="text"
              placeholder="Add note title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
            <button type="submit">Add Note</button>
          </form>

          <div className="note-list">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <div key={note._id} className="note-title">
                  <span
                    onClick={() => navigate(`/note/${note._id}`)}
                    className="note-clickable"
                  >
                    📝 {note.title}
                  </span>
                  <span className="folder-actions">
                    <span className="note-timestamp">
                      🕒 {new Date(note.createdAt).toLocaleString()}
                    </span>
                    <button onClick={() => navigate(`/note/${note._id}`)}>
                      ✏️
                    </button>
                    <button onClick={() => handleDeleteNote(note._id)}>
                      ❌
                    </button>
                  </span>
                </div>
              ))
            ) : (
              <p className="no-notes">No notes match your search.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
