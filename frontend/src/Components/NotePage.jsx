import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import "./NotePage.css";

export default function NotePage() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [content, setContent] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchNote = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/notes/${id}`, {
          headers: { Authorization: token },
        });
        setNote(res.data);
        setContent(res.data.content);
      } catch (err) {
        alert("Note not found");
        navigate("/notes");
      }
    };

    fetchNote();
  }, [id, navigate, token]);

  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/notes/${id}`,
        { content, category: note?.category || "" },
        { headers: { Authorization: token } }
      );
      alert("Note saved!");
    } catch (err) {
      alert("Error saving note");
    }
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(note?.title || "Untitled Note", 10, 20);
    doc.setFontSize(12);
    const splitContent = doc.splitTextToSize(content || "", 180);
    doc.text(splitContent, 10, 30);
    doc.save(`${note?.title || "note"}.pdf`);
  };

  return (
    <div className="note-page-wrapper">
      <h1>Edit Note</h1>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={15}
        cols={80}
      />
      <div className="note-page-buttons">
        <button onClick={handleSave}>Save</button>
        <button onClick={handleDownload}>Download PDF</button>
        <button onClick={() => navigate("/notes")}>Back</button>
      </div>
    </div>
  );
}
