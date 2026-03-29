# 📝 Notes-Web App

A full-stack note-taking web application built for productivity and organization.  
It supports authentication, rich note features, and a modern UI/UX.

---

## 🚀 Tech Stack

### 🔧 Backend
- Node.js
- Express.js
- MongoDB (Mongoose ODM)
- JWT Authentication
- bcryptjs (Password hashing)

### 🎨 Frontend
- React 19 + Vite
- Redux Toolkit
- React Router
- Tailwind CSS
- Axios
- React Hot Toast

---

## 🏗️ Architecture

### Backend (Node.js + Express)
- RESTful API design
- MongoDB with Mongoose schemas
- JWT-based authentication
- Rate limiting (Auth endpoints)
- Email validation
- Secure password hashing
- Centralized error handling
- CORS enabled

### Frontend (React + Vite)
- Fast development with Vite
- Global state via Redux Toolkit
- Client-side routing with React Router
- Responsive UI with Tailwind CSS
- API handling using Axios
- Toast notifications for UX

---

## ✨ Features

### 👤 User Management
- User registration & login
- JWT authentication
- User profile with preferences:
  - Theme (dark/light)
  - Default view (grid/list)
  - Accent color
- Secure password storage (bcrypt)
- Session persistence

---

### 🗒️ Note Management

#### Core Features
- Create notes
- Read notes
- Update notes
- Delete notes

#### Advanced Features
- 🔍 Full-text search (title, content, tags)
- 🏷️ Tagging system
- 🎨 Color coding
- 📌 Pin notes
- 📦 Archive notes
- 🗑️ Trash (soft delete + restore)
- ✅ Checklist inside notes
- ⏰ Reminders
- 📝 Word count tracking
- 🕒 Created & updated timestamps

---

## 🧩 UI Components

- 📊 Dashboard (Grid/List view)
- ✍️ Note Editor (Rich text support)
- 🔎 Search bar
- 🧭 Sidebar navigation:
  - All Notes
  - Pinned Notes
  - Regular Notes
  - Archived Notes
  - Trashed Notes
- 🏷️ Tag filtering
- 👤 Navbar with user info
- ⏳ Loading skeletons
- 📭 Empty states with actions

---

## 🔗 API Routes

### Auth Routes