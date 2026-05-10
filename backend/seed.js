require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');

async function seedData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected. Clearing old data...');

    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});

    console.log('Creating robust dummy data...');
    const hashedPwd = await bcrypt.hash('password123', 10);

    // Create 3 Recruiters
    const r1 = await User.create({ username: 'recruiter_alice', password: hashedPwd, role: 'recruiter' });
    const r2 = await User.create({ username: 'recruiter_bob', password: hashedPwd, role: 'recruiter' });
    const r3 = await User.create({ username: 'recruiter_carol', password: hashedPwd, role: 'recruiter' });

    // Create 10 Candidates
    const c1 = await User.create({ username: 'candidate_john', password: hashedPwd, role: 'candidate' });
    const c2 = await User.create({ username: 'candidate_jane', password: hashedPwd, role: 'candidate' });
    const c3 = await User.create({ username: 'candidate_alex', password: hashedPwd, role: 'candidate' });
    const c4 = await User.create({ username: 'candidate_sarah', password: hashedPwd, role: 'candidate' });
    const c5 = await User.create({ username: 'candidate_mike', password: hashedPwd, role: 'candidate' });
    const c6 = await User.create({ username: 'candidate_emily', password: hashedPwd, role: 'candidate' });
    const c7 = await User.create({ username: 'candidate_david', password: hashedPwd, role: 'candidate' });
    const c8 = await User.create({ username: 'candidate_lisa', password: hashedPwd, role: 'candidate' });
    const c9 = await User.create({ username: 'candidate_tom', password: hashedPwd, role: 'candidate' });
    const c10 = await User.create({ username: 'candidate_emma', password: hashedPwd, role: 'candidate' });

    // Create 4 Jobs
    const j1 = await Job.create({
      title: 'Senior Frontend Developer',
      description: 'We are looking for an expert in React, Vite, and modern CSS to lead our frontend team.',
      requirements: '5+ years experience in React. Strong understanding of state management and performance tuning.',
      recruiterId: r1._id
    });
    const j2 = await Job.create({
      title: 'Backend Node.js Engineer',
      description: 'Join our team to build scalable microservices using Express, MongoDB, and AWS.',
      requirements: '3+ years experience with Node.js and MongoDB. Experience with REST APIs.',
      recruiterId: r1._id
    });
    const j3 = await Job.create({
      title: 'Full Stack Web Developer',
      description: 'Looking for a generalist to work on end-to-end features using the MERN stack.',
      requirements: 'Experience with MongoDB, Express, React, Node.js. Good UI/UX sense.',
      recruiterId: r2._id
    });
    const j4 = await Job.create({
      title: 'DevOps Engineer',
      description: 'We need someone to manage our CI/CD pipelines and AWS infrastructure.',
      requirements: 'Experience with Docker, Kubernetes, GitHub Actions, and AWS.',
      recruiterId: r1._id
    });

    // Create 10 Applications
    await Application.create([
      { candidateId: c1._id, jobId: j1._id, resumeText: 'I am a Senior Frontend Developer with 6 years of experience in React, Vite, Redux, and modern CSS architecture.', attachmentNotes: 'Looking forward to this opportunity.', status: 'Hired', matchScore: 92 },
      { candidateId: c2._id, jobId: j1._id, resumeText: 'I am a backend developer. I know Python, Django, and PostgreSQL. I have never used React.', attachmentNotes: 'I am willing to learn.', status: 'ScreeningRejected', matchScore: 25, screeningFeedback: 'Candidate lacks the required frontend skills, specifically React and Vite, as outlined in the job description.' },
      { candidateId: c3._id, jobId: j1._id, resumeText: 'I am a junior frontend dev. I know HTML, CSS, and some React basics.', attachmentNotes: '', status: 'ScreeningRejected', matchScore: 45, screeningFeedback: 'Candidate does not meet the 5+ years seniority requirement and lacks advanced state management knowledge.' },
      { candidateId: c4._id, jobId: j1._id, resumeText: 'React expert with 4 years of experience building high-performance UIs using Vite and Redux.', attachmentNotes: 'Available to start immediately.', status: 'InInterview', matchScore: 85 },
      { candidateId: c5._id, jobId: j1._id, resumeText: 'Frontend engineer with strong Angular background. Recently started learning React.', attachmentNotes: '', status: 'Applied', matchScore: 65 },
      { candidateId: c6._id, jobId: j2._id, resumeText: 'Experienced Backend Engineer. 4 years of Node.js, Express, and MongoDB. Built multiple scalable REST APIs deployed on AWS.', attachmentNotes: 'Ready to join immediately.', status: 'Shortlisted', matchScore: 88 },
      { candidateId: c7._id, jobId: j2._id, resumeText: 'Full stack developer. Good at Node and React.', attachmentNotes: '', status: 'InterviewRejected', matchScore: 75, interviewFeedbackSummary: 'Thank you for your time. While your Node.js skills are solid, we found a gap in advanced MongoDB aggregation knowledge required for this specific role. We encourage you to apply again in the future.' },
      { candidateId: c8._id, jobId: j2._id, resumeText: 'Java developer looking to switch to Node.js.', attachmentNotes: '', status: 'ScreeningRejected', matchScore: 30, screeningFeedback: 'Candidate does not have the required 3+ years of professional Node.js and MongoDB experience.' },
      { candidateId: c9._id, jobId: j2._id, resumeText: 'Senior Node.js architect. 7 years experience designing distributed systems on AWS with MongoDB and Redis.', attachmentNotes: 'Can lead the backend team.', status: 'InInterview', matchScore: 98 },
      { candidateId: c10._id, jobId: j2._id, resumeText: 'Node.js developer. Worked on a few Express projects.', attachmentNotes: '', status: 'Applied', matchScore: 60 }
    ]);

    console.log('✅ MongoDB Database Seeded Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
