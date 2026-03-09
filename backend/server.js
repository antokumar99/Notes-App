const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./config/db');

connectDB();
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// app.use("api/auth",authRoutes);

app.get('/', (req, res) => {
    res.send("Hello World");
});

app.use('/api/auth', authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});