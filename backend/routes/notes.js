import express from "express";
import Note from "../models/Note.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Fetch notes
router.get("/", verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({
      pinned: -1,
      createdAt: -1,
    });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notes" });
  }
});

// Delete note
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting note" });
  }
});

// Update note
router.put("/:id", verifyToken, async (req, res) => {
  const { title, content, category } = req.body;
  try {
    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, category },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating note" });
  }
});

// Toggle pin
router.patch("/:id/pin", verifyToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    note.pinned = !note.pinned;
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Error pinning note" });
  }
});

// Delete all notes in a folder
router.delete("/folder/:category", verifyToken, async (req, res) => {
  const { category } = req.params;
  try {
    await Note.deleteMany({ user: req.user.id, category });
    res.json({ message: `Folder '${category}' and its notes deleted.` });
  } catch (err) {
    res.status(500).json({ message: "Error deleting folder" });
  }
});

// Rename a folder
router.put("/folder/:oldCategory", verifyToken, async (req, res) => {
  const { oldCategory } = req.params;
  const { newCategory } = req.body;

  if (!newCategory) {
    return res.status(400).json({ message: "New category name is required" });
  }

  try {
    await Note.updateMany(
      { user: req.user.id, category: oldCategory },
      { category: newCategory }
    );
    res.json({ message: `Folder renamed to '${newCategory}'` });
  } catch (err) {
    res.status(500).json({ message: "Error renaming folder" });
  }
});

// Get a single note by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (err) {
    console.error("Error fetching single note:", err.message);
    res.status(500).json({ message: "Error fetching note" });
  }
});

router.post("/", verifyToken, async (req, res) => {
  const { title, content, category } = req.body;
  const userId = req.user?.id;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const newNote = new Note({ title, content, category, user: userId });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    console.error("Error adding note:", err.message);
    res.status(500).json({ message: "Server error while adding note" });
  }
});

export default router;
