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

// Create a new job
app.post('/jobs', async (req, res) => {
    try {
        const job = new Job(req.body);
        await job.save();
        res.status(201).send({ message: 'Job created successfully', job });
    } catch (err) {
        res.status(400).send({ message: 'Failed to create job', error: err.message });
    }
});

// Update a job
app.put('/jobs/:id', async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!job) {
            return res.status(404).send({ message: 'Job not found' });
        }
        res.status(200).send({ message: 'Job updated successfully', job });
    } catch (err) {
        res.status(400).send({ message: 'Failed to update job', error: err.message });
    }
});

// Delete a job
app.delete('/jobs/:id', async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'Job deleted' });
    } catch (err) {
        res.status(500).send(err);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});