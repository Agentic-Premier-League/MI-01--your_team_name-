require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');
const ai = require('./ai');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// --- JSON DB Initialization ---
let db = { users: [], jobs: [], applications: [] };
const USE_JSON = process.env.USE_JSON_DB === 'true';

if (USE_JSON) {
  try {
    const dataPath = path.join(__dirname, 'data.json');
    if (fs.existsSync(dataPath)) {
      db = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      console.log('Loaded JSON database from data.json');
    }
  } catch (err) {
    console.error('Error loading JSON DB:', err);
  }
} else {
  // Database connection
  mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hiring-platform')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
}

const saveData = () => {
  if (USE_JSON) {
    fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(db, null, 2));
  }
};

const generateId = () => Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);

// --- Auth Routes ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    if (USE_JSON) {
      if (db.users.find(u => u.username === username)) return res.status(400).json({ error: 'Username taken' });
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = { _id: generateId(), username, password: hashedPassword, role };
      db.users.push(user);
      saveData();
      return res.status(201).json({ message: 'User created' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: 'Username taken' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    let user;

    if (USE_JSON) {
      user = db.users.find(u => u.username === username);
    } else {
      user = await User.findOne({ username });
    }

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, role: user.role, userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// --- Job Routes ---
app.post('/api/jobs', auth, async (req, res) => {
  if (req.user.role !== 'recruiter') return res.status(403).json({ error: 'Forbidden' });
  try {
    if (USE_JSON) {
      const job = { _id: generateId(), ...req.body, recruiterId: req.user.userId, createdAt: new Date().toISOString() };
      db.jobs.push(job);
      saveData();
      return res.status(201).json(job);
    }

    const job = new Job({ ...req.body, recruiterId: req.user.userId });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/jobs', auth, async (req, res) => {
  try {
    if (USE_JSON) {
      if (req.user.role === 'recruiter') {
        return res.json(db.jobs.filter(j => j.recruiterId === req.user.userId));
      } else {
        return res.json(db.jobs);
      }
    }

    if (req.user.role === 'recruiter') {
      const jobs = await Job.find({ recruiterId: req.user.userId });
      res.json(jobs);
    } else {
      const jobs = await Job.find(); // Candidates see all jobs
      res.json(jobs);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/jobs/:id', auth, async (req, res) => {
  try {
    if (USE_JSON) {
      const job = db.jobs.find(j => j._id === req.params.id);
      if (!job) return res.status(404).json({ error: 'Job not found' });
      return res.json(job);
    }

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Application Routes ---
app.post('/api/applications', auth, async (req, res) => {
  if (req.user.role !== 'candidate') return res.status(403).json({ error: 'Forbidden' });
  try {
    const { jobId, resumeText, attachmentNotes } = req.body;
    
    let jobDescReq = '';
    if (USE_JSON) {
      const job = db.jobs.find(j => j._id === jobId);
      if (!job) return res.status(404).json({ error: 'Job not found' });
      jobDescReq = job.description + '\n' + job.requirements;
    } else {
      const job = await Job.findById(jobId);
      if (!job) return res.status(404).json({ error: 'Job not found' });
      jobDescReq = job.description + '\n' + job.requirements;
    }

    const screeningResult = await ai.screenCandidate(resumeText, jobDescReq);
    
    let status = 'Applied';
    let feedback = null;
    
    if (screeningResult.score < 70) {
      status = 'ScreeningRejected';
      feedback = screeningResult.feedback;
    } else {
      status = 'Shortlisted';
    }

    if (USE_JSON) {
      const application = {
        _id: generateId(),
        candidateId: req.user.userId,
        jobId,
        resumeText,
        attachmentNotes,
        status,
        matchScore: screeningResult.score,
        screeningFeedback: feedback,
        createdAt: new Date().toISOString()
      };
      db.applications.push(application);
      saveData();
      return res.status(201).json(application);
    }

    const application = new Application({
      candidateId: req.user.userId,
      jobId,
      resumeText,
      attachmentNotes,
      status,
      matchScore: screeningResult.score,
      screeningFeedback: feedback
    });

    await application.save();
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/applications/my', auth, async (req, res) => {
  if (req.user.role !== 'candidate') return res.status(403).json({ error: 'Forbidden' });
  try {
    if (USE_JSON) {
      const apps = db.applications.filter(a => a.candidateId === req.user.userId).map(app => {
        return { ...app, jobId: db.jobs.find(j => j._id === app.jobId) };
      });
      return res.json(apps);
    }

    const applications = await Application.find({ candidateId: req.user.userId }).populate('jobId');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/jobs/:id/candidates', auth, async (req, res) => {
  if (req.user.role !== 'recruiter') return res.status(403).json({ error: 'Forbidden' });
  try {
    if (USE_JSON) {
      const apps = db.applications.filter(a => a.jobId === req.params.id).map(app => {
        return { ...app, candidateId: db.users.find(u => u._id === app.candidateId) || { username: 'Unknown' } };
      }).sort((a, b) => b.matchScore - a.matchScore);
      return res.json(apps);
    }

    const applications = await Application.find({ jobId: req.params.id })
      .populate('candidateId', 'username')
      .sort({ matchScore: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/applications/:id/status', auth, async (req, res) => {
  if (req.user.role !== 'recruiter') return res.status(403).json({ error: 'Forbidden' });
  try {
    const { status } = req.body;
    
    if (USE_JSON) {
      const appIndex = db.applications.findIndex(a => a._id === req.params.id);
      if (appIndex === -1) return res.status(404).json({ error: 'Not found' });
      db.applications[appIndex].status = status;
      saveData();
      return res.json(db.applications[appIndex]);
    }

    const application = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/applications/:id/interview-reject', auth, async (req, res) => {
  if (req.user.role !== 'recruiter') return res.status(403).json({ error: 'Forbidden' });
  try {
    const { techScore, knowledgeGap, additionalComment } = req.body;
    const feedbackSummary = await ai.generateFeedbackSummary(techScore, knowledgeGap, additionalComment);
    
    if (USE_JSON) {
      const appIndex = db.applications.findIndex(a => a._id === req.params.id);
      if (appIndex === -1) return res.status(404).json({ error: 'Not found' });
      db.applications[appIndex].status = 'InterviewRejected';
      db.applications[appIndex].interviewFeedbackSummary = feedbackSummary;
      saveData();
      return res.json(db.applications[appIndex]);
    }

    const application = await Application.findByIdAndUpdate(req.params.id, {
      status: 'InterviewRejected',
      interviewFeedbackSummary: feedbackSummary
    }, { new: true });
    
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Analytics ---
app.get('/api/analytics', auth, async (req, res) => {
  if (req.user.role !== 'recruiter') return res.status(403).json({ error: 'Forbidden' });
  try {
    const stats = { Applied: 0, Shortlisted: 0, ScreeningRejected: 0, InInterview: 0, InterviewRejected: 0, Hired: 0 };
    
    if (USE_JSON) {
      const myJobs = db.jobs.filter(j => j.recruiterId === req.user.userId).map(j => j._id);
      const myApps = db.applications.filter(a => myJobs.includes(a.jobId));
      myApps.forEach(app => {
        if (stats[app.status] !== undefined) stats[app.status]++;
      });
      return res.json(stats);
    }

    const jobs = await Job.find({ recruiterId: req.user.userId });
    const jobIds = jobs.map(j => j._id);
    const applications = await Application.find({ jobId: { $in: jobIds } });
    
    applications.forEach(app => {
      if (stats[app.status] !== undefined) stats[app.status]++;
    });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Chatbot ---
app.post('/api/chat', auth, async (req, res) => {
  if (req.user.role !== 'candidate') return res.status(403).json({ error: 'Forbidden' });
  try {
    const { applicationId, message, history } = req.body;
    let resumeText = '';
    let jobDescReq = '';

    if (USE_JSON) {
      const application = db.applications.find(a => a._id === applicationId);
      if (!application) return res.status(404).json({ error: 'Application not found' });
      const job = db.jobs.find(j => j._id === application.jobId);
      resumeText = application.resumeText;
      jobDescReq = job.description + '\n' + job.requirements;
    } else {
      const application = await Application.findById(applicationId).populate('jobId');
      if (!application) return res.status(404).json({ error: 'Application not found' });
      resumeText = application.resumeText;
      jobDescReq = application.jobId.description + '\n' + application.jobId.requirements;
    }
    
    const reply = await ai.chatWithCandidate(message, history || [], resumeText, jobDescReq);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
