require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const sampleRoutes = require('./routes/sampleRoutes');

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.use('/api/sample', sampleRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
