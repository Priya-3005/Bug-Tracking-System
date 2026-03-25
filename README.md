# 🐛 BugTrackr — Issue Tracking System

A full-stack bug tracking application built with React, Node.js, Express, and MongoDB.

---

## 📁 Project Structure

```
bugtracker/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Bug.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── bugs.js
│   │   └── users.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── seed.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Badge.jsx
    │   │   ├── BugDetailModal.jsx
    │   │   ├── CreateBugModal.jsx
    │   │   ├── EmptyState.jsx
    │   │   ├── Loader.jsx
    │   │   ├── Modal.jsx
    │   │   ├── Sidebar.jsx
    │   │   └── TopBar.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── BugsPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   └── UsersPage.jsx
    │   ├── utils/
    │   │   ├── api.js
    │   │   └── helpers.js
    │   ├── App.jsx
    │   ├── index.js
    │   └── index.css
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

---

## ⚙️ Prerequisites

Make sure you have these installed:

- **Node.js** v16+ → https://nodejs.org
- **MongoDB** (local) → https://www.mongodb.com/try/download/community
  - OR use MongoDB Atlas (free cloud) → https://cloud.mongodb.com
- **npm** (comes with Node.js)

---

## 🚀 Setup & Run Instructions

### Step 1: Start MongoDB

**Option A — Local MongoDB:**
```bash
mongod
```

**Option B — MongoDB Atlas:**
- Create a free cluster at cloud.mongodb.com
- Get your connection string
- Replace `MONGODB_URI` in `backend/.env`

---

### Step 2: Setup Backend

```bash
# Navigate to backend
cd bugtracker/backend

# Install dependencies
npm install

# Edit .env if needed (default works for local MongoDB)
# MONGODB_URI=mongodb://localhost:27017/bugtracker
# PORT=5000

# Seed the database with demo data (optional but recommended)
node seed.js

# Start the backend server
npm run dev
```

✅ Backend will run at: **http://localhost:5000**

---

### Step 3: Setup Frontend

Open a **new terminal**:

```bash
# Navigate to frontend
cd bugtracker/frontend

# Install dependencies
npm install

# Start the React dev server
npm start
```

✅ Frontend will open at: **http://localhost:3000**

---

## 🔑 Demo Login Credentials

After running `node seed.js`:

| Role      | Email             | Password  |
|-----------|-------------------|-----------|
| Admin     | admin@demo.com    | demo123   |
| Developer | dev@demo.com      | demo123   |
| Tester    | tester@demo.com   | demo123   |

---

## 👥 Role Capabilities

| Feature              | Admin | Developer | Tester |
|---------------------|-------|-----------|--------|
| View Dashboard      | ✅    | ✅        | ✅     |
| View All Bugs       | ✅    | ✅ (assigned) | ✅ (own) |
| Create Bug          | ✅    | ✅        | ✅     |
| Assign Bug          | ✅    | ❌        | ❌     |
| Update Status       | ✅    | ✅        | ✅     |
| Delete Bug          | ✅    | ❌        | ❌     |
| Manage Users        | ✅    | ❌        | ❌     |
| Add Comments        | ✅    | ✅        | ✅     |

---

## 🌐 REST API Endpoints

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login

### Bugs
- `GET /api/bugs` — Get all bugs (with filters)
- `GET /api/bugs/stats` — Dashboard stats
- `GET /api/bugs/:id` — Get single bug
- `POST /api/bugs` — Create bug
- `PUT /api/bugs/:id` — Update bug
- `POST /api/bugs/:id/comments` — Add comment
- `DELETE /api/bugs/:id` — Delete bug (admin only)

### Users
- `GET /api/users` — All users (admin only)
- `GET /api/users/developers` — Get developers list
- `PUT /api/users/:id/role` — Update user role

---

## 🎨 Features

- ✅ Role-based authentication (Admin / Developer / Tester)
- ✅ Dashboard with stats cards
- ✅ Create, view, update, delete bugs
- ✅ Assign bugs to developers (Admin)
- ✅ Status workflow: New → Assigned → In Progress → Resolved → Closed → Reopened
- ✅ Priority levels: Low / Medium / High / Critical
- ✅ Severity levels: Minor / Major / Critical / Blocker
- ✅ Comments on bugs
- ✅ Filter by status and priority
- ✅ Search bugs by title/description
- ✅ Sortable columns
- ✅ Toast notifications
- ✅ Loading states and skeleton loaders
- ✅ Empty states
- ✅ Responsive sidebar navigation
- ✅ Color-coded status and priority badges
- ✅ User management (Admin)

---

## 🛠️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Tailwind CSS, Lucide Icons |
| Backend   | Node.js, Express.js                  |
| Database  | MongoDB, Mongoose                    |
| UI        | react-hot-toast, date-fns            |

---

## 🐞 Troubleshooting

**MongoDB connection failed?**
→ Make sure `mongod` is running, or check your Atlas URI in `.env`

**Frontend can't connect to backend?**
→ Ensure backend is running on port 5000. Check `package.json` proxy setting.

**Demo logins don't work?**
→ Run `node seed.js` from the backend folder first.
