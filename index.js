require('dotenv').config();
const express = require('express');
const connectDB = require('./mongodb/connect');
const Job = require("./mongodb/models/jobsModel");

const app = express();
connectDB(); // Initialize MongoDB connection

app.use(express.json());

// Get all jobs
app.get('/jobs', async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).send(jobs);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get a job by ID
app.get('/jobs/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).send({ message: 'Job not found' });
        }
        res.status(200).send(job);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});