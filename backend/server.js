const express = require('express');
const cors = require('cors');
require('dotenv').config();

const studentsRouter = require('./routes/students');

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'https://ycchenn.github.io',
    'https://classpointsproject.vercel.app'
  ]
}))
app.use(express.json());

app.use('/api/students', studentsRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));