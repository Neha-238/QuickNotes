// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./FolderNotes.css";

// export default function FolderNotes() {
//   const { folderName } = useParams();
//   const [notes, setNotes] = useState([]);
//   const [newTitle, setNewTitle] = useState("");
//   const [editingNoteId, setEditingNoteId] = useState(null);
//   const [editedTitle, setEditedTitle] = useState("");
//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!token) {
//       navigate("/");
//       return;
//     }
//     fetchNotesInFolder();
//   }, [folderName]);

//   const fetchNotesInFolder = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/notes", {
//         headers: { Authorization: token },
//       });
//       const folderNotes = res.data.filter(
//         (note) => note.category === folderName
//       );
//       setNotes(folderNotes);
//     } catch (err) {
//       alert("Failed to load notes");
//     }
//   };

//   const handleAddNote = async (e) => {
//     e.preventDefault();
//     if (!newTitle.trim()) return;
//     try {
//       await axios.post(
//         "http://localhost:5000/api/notes",
//         {
//           title: newTitle.trim(),
//           content: " ",
//           category: folderName,
//         },
//         { headers: { Authorization: token } }
//       );
//       setNewTitle("");
//       fetchNotesInFolder();
//     } catch (err) {
//       alert("Failed to add note");
//     }
//   };

//   const handleDeleteNote = async (id) => {
//     const confirm = window.confirm("Delete this note?");
//     if (!confirm) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/notes/${id}`, {
//         headers: { Authorization: token },
//       });
//       fetchNotesInFolder();
//     } catch (err) {
//       alert("Failed to delete note");
//     }
//   };

//   const handleEdit = (note) => {
//     setEditingNoteId(note._id);
//     setEditedTitle(note.title);
//   };

//   const handleSaveEdit = async (note) => {
//     if (!editedTitle.trim()) return;
//     try {
//       await axios.put(
//         `http://localhost:5000/api/notes/${note._id}`,
//         {
//           title: editedTitle.trim(),
//           content: note.content,
//           category: note.category,
//         },
//         { headers: { Authorization: token } }
//       );
//       setEditingNoteId(null);
//       setEditedTitle("");
//       fetchNotesInFolder();
//     } catch (err) {
//       alert("Failed to update title");
//     }
//   };

//   return (
//     <div className="folder-notes-wrapper">
//       <div className="folder-header">
//         <h2>📁 Folder: {folderName}</h2>
//         <button className="back-button" onClick={() => navigate("/notes")}>
//           ⬅ Back
//         </button>
//       </div>

//       <form onSubmit={handleAddNote} className="add-note-form">
//         <input
//           type="text"
//           placeholder="Enter note title"
//           value={newTitle}
//           onChange={(e) => setNewTitle(e.target.value)}
//           required
//         />
//         <button type="submit">Add Note</button>
//       </form>

//       <div className="note-list">
//         {notes.length > 0 ? (
//           notes.map((note) => (
//             <div key={note._id} className="note-title">
//               {editingNoteId === note._id ? (
//                 <>
//                   <input
//                     className="edit-title-input"
//                     value={editedTitle}
//                     onChange={(e) => setEditedTitle(e.target.value)}
//                   />
//                   <span className="folder-actions">
//                     <button type="button" onClick={() => handleSaveEdit(note)}>
//                       💾
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => setEditingNoteId(null)}
//                     >
//                       ❌
//                     </button>
//                   </span>
//                 </>
//               ) : (
//                 <>
//                   <span
//                     className="note-clickable"
//                     onClick={() => navigate(`/note/${note._id}`)}
//                   >
//                     📝 {note.title}
//                   </span>
//                   <span className="folder-actions">
//                     <button onClick={() => handleEdit(note)}>✏️</button>
//                     <button onClick={() => handleDeleteNote(note._id)}>
//                       ❌
//                     </button>
//                   </span>
//                 </>
//               )}
//             </div>
//           ))
//         ) : (
//           <p className="no-notes">No notes in this folder yet.</p>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./FolderNotes.css";

export default function FolderNotes() {
  const { folderName } = useParams();
  const [notes, setNotes] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchNotesInFolder();
  }, [folderName]);

  const fetchNotesInFolder = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notes", {
        headers: { Authorization: token },
      });
      const folderNotes = res.data.filter(
        (note) => note.category === folderName
      );
      setNotes(folderNotes);
    } catch (err) {
      alert("Failed to load notes");
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
          content: " ",
          category: folderName,
        },
        { headers: { Authorization: token } }
      );
      setNewTitle("");
      fetchNotesInFolder();
    } catch (err) {
      alert("Failed to add note");
    }
  };

  const handleDeleteNote = async (id) => {
    const confirmDelete = window.confirm("Delete this note?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: { Authorization: token },
      });
      fetchNotesInFolder();
    } catch (err) {
      alert("Failed to delete note");
    }
  };

  const handleEditNoteTitle = async (note) => {
    const newTitle = prompt("Enter new title name:", note.title);
    if (!newTitle || newTitle.trim() === "" || newTitle === note.title) return;
    try {
      await axios.put(
        `http://localhost:5000/api/notes/${note._id}`,
        {
          title: newTitle.trim(),
          content: note.content,
          category: note.category,
        },
        { headers: { Authorization: token } }
      );
      fetchNotesInFolder();
    } catch (err) {
      alert("Failed to update note title");
    }
  };

  return (
    <div className="folder-notes-wrapper">
      <div className="folder-header">
        <h2>📁 Folder: {folderName}</h2>
        <button className="back-button" onClick={() => navigate("/notes")}>
          ⬅ Back
        </button>
      </div>

      <form onSubmit={handleAddNote} className="add-note-form">
        <input
          type="text"
          placeholder="Enter note title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          required
        />
        <button type="submit">Add Note</button>
      </form>

      <div className="note-list">
        {notes.length > 0 ? (
          notes.map((note) => (
            <div key={note._id} className="note-title">
              <span
                className="note-clickable"
                onClick={() => navigate(`/note/${note._id}`)}
              >
                📝 {note.title}
              </span>
              <span className="folder-actions">
                <span className="note-timestamp">
                  🕒 {new Date(note.createdAt).toLocaleString()}
                </span>
                <button onClick={() => handleEditNoteTitle(note)}>✏️</button>
                <button onClick={() => handleDeleteNote(note._id)}>❌</button>
              </span>
            </div>
          ))
        ) : (
          <p className="no-notes">No notes in this folder yet.</p>
        )}
      </div>
    </div>
  );
}
