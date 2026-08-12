# 🚀 ManageX

**ManageX** is a modern role-based management system for managing members, divisions, attendance, and user access in one centralized platform.

The system provides secure authentication, role-based permissions, member management, and a clean dashboard designed for easy daily management.

## ✨ Current Features

- 🔐 JWT authentication
- 👥 Member management
- 🏢 Division-based organization
- 🛡️ Role-based access control
- 📊 Dashboard interface
- 🔑 Admin, Supervisor, and User roles
- 📱 Responsive interface

## 👤 Roles

- **Admin** — Full system management access
- **Supervisor** — Member and attendance management based on permissions
- **User** — Limited access to permitted information

## 🛠️ Tech Stack

**Frontend:** React, React Router, Context API, CSS  
**Backend:** Node.js, Express, MongoDB, Mongoose  
**Authentication:** JWT, bcrypt

## 📁 Project Structure

```text
management-system/
│
├── client/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       │   ├── Login/
│       │   ├── SignUp/
│       │   ├── Dashboard/
│       │   ├── AllMember/
│       │   ├── Attendance/
│       │   ├── Settings/
│       │   ├── AccessDenied/
│       │   └── NotFound/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md


🚀 Future Updates

ManageX is still under active development. More features will be released in future updates, including:

📋 Fully functional attendance system with real attendance records
📊 Real-time dashboard data instead of static/mock information
📈 Real attendance and member analytics
📅 Real session and event management
🔔 Additional system notifications and improvements

The goal is to gradually turn ManageX into a complete, data-driven management platform.

ManageX — Manage smarter. Stay organized.

**Developed by Amir Nesru**