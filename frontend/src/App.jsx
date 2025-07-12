//src / App.jsx;
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Notes from "./Components/Notes";
import NotePage from "./Components/NotePage"; // ✅ Make sure the path is correct
import FolderNotes from "./Components/FolderNotes";

// Simple auth check (replace with your real logic)
const isAuthenticated = () => !!localStorage.getItem("token");

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
}

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* Protected route */}
      <Route
        path="/notes"
        element={
          <PrivateRoute>
            <Notes />
          </PrivateRoute>
        }
      />

      <Route
        path="/notes/:folderName"
        element={
          <PrivateRoute>
            <FolderNotes />
          </PrivateRoute>
        }
      />

      <Route
        path="/note/:id"
        element={
          <PrivateRoute>
            <NotePage />
          </PrivateRoute>
        }
      />

      {/* Optional: catch all route */}
      <Route path="*" element={<h2>404: Page Not Found</h2>} />
    </Routes>
  );
};

export default App;
