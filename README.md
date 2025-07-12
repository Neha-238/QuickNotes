# 📝 QuickNotes – Full-Stack Note App

**QuickNotes** is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) application designed for secure and efficient note-taking.  
It supports folder-based organization, real-time search, PDF export, and JWT-based authentication to keep your notes organized and protected.

---

## 🚀 Features

- ✅ Secure user login and registration with JWT-based authentication
- 🗂️ Organize notes into folders
- ✍️ Create, edit, and delete notes with timestamps
- 🔎 Real-time search and filtering by content/title
- 📄 Export notes as downloadable PDF files
- 📱 Responsive and user-friendly interface

---

## 🛠️ Tech Stack

- **Frontend:** React.js, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Token (JWT)
- **PDF Generation:** `pdfkit`, `jsPDF`

---

## 🧑‍💻 Getting Started

### 🔧 Prerequisites

Before running the app locally, make sure you have:

- [Node.js](https://nodejs.org/) and npm installed
- [MongoDB](https://www.mongodb.com/) running locally or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

### 📦 Installation Steps

```bash
# Step 1: Clone the repository
git clone https://github.com/Neha-238/QuickNotes.git
cd QuickNotes

# Step 2: Install backend dependencies
cd backend
npm install

# Step 3: Install frontend dependencies
cd ../frontend
npm install

***Environment Setup***
Create a .env file inside the backend/ directory and add the following:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

Replace your_mongodb_connection_string and your_jwt_secret_key with your actual credentials.

***Run the App***
In two terminals:


# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Start frontend
cd frontend
npm run dev


