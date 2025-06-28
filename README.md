🎓 PrepVerse

PrepVerse is a full-stack web application built to connect students, alumni, and Training & Placement (T&P) cells. It enables efficient blog sharing, alumni interaction, and challenge participation to support placement preparation.

---

⚙️ Core Features (As Implemented)

👨‍🎓 Student
- Register/Login using JWT-based auth
- View and participate in coding challenges
- Access blog posts and alumni content

🧑‍💼 Alumni
- Register/Login as alumni
- Post blog entries
- Access relevant student content

🏢 Alumni Admin / T&P Cell
- Manage alumni users
- Post and monitor challenges
- Moderate blog content

---

🧱 Tech Stack

Backend (Node.js + Express)
- Authentication: JWT
- Database: MongoDB with Mongoose
- File Uploads: Multer, Cloudinary
- Mailing: Nodemailer
- Middleware: Role-based Auth (student, alumni, admin)

Frontend (React + Vite)
- Routing: React Router v7
- Styling: Tailwind CSS
- API Calls: Axios
- Notifications: React Toastify

---

📁 Folder Structure (Key Parts)

PrepVerse/
├── backend/
│   ├── controllers/        # Business logic
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoints
│   ├── middlewares/        # Auth middleware
│   ├── config/             # DB, mailer, cloudinary config
│   ├── utils/              # File upload handler (multer)
│   └── server.js           # Express entry point
├── frontend/
│   ├── src/                # React codebase
│   ├── tailwind.config.js  # Tailwind CSS setup
│   └── vite.config.js      # Vite build tool

---

🚀 Getting Started

1️⃣ Clone and Setup

git clone https://github.com/your-username/PrepVerse.git
cd PrepVerse

2️⃣ Backend Setup

cd backend
npm install
cp .env.example .env  # Add your Mongo URI, JWT secret, etc.
npm run dev

3️⃣ Frontend Setup

cd ../frontend
npm install
npm run dev

Open http://localhost:5173 in your browser.

---

🔐 Environment Variables (backend/.env)

MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL=your_email
EMAIL_PASS=your_email_password

---

🚫 .gitignore Recommendation

node_modules/
.env
allCredentials.txt
