import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import dbConnect from './config/db.js';
import alumniadminroute from './routes/alumniAdmin.routes.js';
import alumniRouter from './routes/alumni.routes.js';
import blogsrouter from './routes/blogs.routes.js';
import studentRouter from './routes/student.routes.js';
import challengeRouter from './routes/challenge.routes.js';
import tprouter from './routes/tp.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Middlewares
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome home');
});

app.use('/alumniAdmin', alumniadminroute);
app.use('/alumni', alumniRouter);
app.use('/alumni/blogs', blogsrouter);
app.use('/students/blogs',blogsrouter)
app.use('/student', studentRouter);
app.use('/challenge', challengeRouter);
app.use('/tp',tprouter)
// Connect DB first, then start server
const startServer = async () => {
  await dbConnect();
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
};

startServer();