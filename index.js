const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/auth');
const mongoose = require('mongoose');
const connectDB = require('./config/connectDB');
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT || 9000, () => {
    connectDB();
    console.log("server is up and running");
})