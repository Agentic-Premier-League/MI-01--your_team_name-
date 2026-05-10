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
    console.log('Connected.');

    console.log('Clearing old data...');
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});

    console.log('Creating users...');
    const hashedPwd = await bcrypt.hash('password123', 10);
    
    // Recruiter
    const recruiter1 = await User.create({ username: 'recruiter_alice', password: hashedPwd, role: 'recruiter' });
    const recruiter2 = await User.create({ username: 'recruiter_bob', password: hashedPwd, role: 'recruiter' });

    // Candidates
    const candidate1 = await User.create({ username: 'candidate_john', password: hashedPwd, role: 'candidate' });
    const candidate2 = await User.create({ username: 'candidate_jane', password: hashedPwd, role: 'candidate' });
    const candidate3 = await User.create({ username: 'candidate_alex', password: hashedPwd, role: 'candidate' });

    console.log('Creating jobs...');
    const job1 = await Job.create({
      title: 'Senior Frontend Developer',
      description: 'We are looking for an expert in React, Vite, and modern CSS to lead our frontend team.',
      requirements: '5+ years experience in React. Strong understanding of state management and performance tuning.',
      recruiterId: recruiter1._id
    });

    const job2 = await Job.create({
      title: 'Backend Node.js Engineer',
      description: 'Join our team to build scalable microservices using Express, MongoDB, and AWS.',
      requirements: '3+ years experience with Node.js and MongoDB. Experience with REST APIs.',
      recruiterId: recruiter1._id
    });

    console.log('Creating applications...');
    // Good application
    await Application.create({
      candidateId: candidate1._id,
      jobId: job1._id,
      resumeText: 'I am a Senior Frontend Developer with 6 years of experience in React, Vite, Redux, and modern CSS architecture. I have led teams of 5 developers.',
      attachmentNotes: 'Looking forward to this opportunity.',
      status: 'Shortlisted',
      matchScore: 92
    });

    // Poor application
    await Application.create({
      candidateId: candidate2._id,
      jobId: job1._id,
      resumeText: 'I am a backend developer. I know Python, Django, and PostgreSQL. I have never used React.',
      attachmentNotes: 'I am willing to learn.',
      status: 'ScreeningRejected',
      matchScore: 25,
      screeningFeedback: 'Candidate lacks the required frontend skills, specifically React and Vite, as outlined in the job description.'
    });

    // Application in interview
    await Application.create({
      candidateId: candidate3._id,
      jobId: job2._id,
      resumeText: 'Experienced Backend Engineer. 4 years of Node.js, Express, and MongoDB. Built multiple scalable REST APIs deployed on AWS.',
      attachmentNotes: 'Ready to join immediately.',
      status: 'InInterview',
      matchScore: 88
    });

    // Rejected after interview
    await Application.create({
      candidateId: candidate1._id,
      jobId: job2._id,
      resumeText: 'Full stack developer. Good at Node and React.',
      attachmentNotes: '',
      status: 'InterviewRejected',
      matchScore: 75,
      interviewFeedbackSummary: 'Thank you for your time. While your Node.js skills are solid, we found a gap in advanced MongoDB aggregation knowledge required for this specific role. We encourage you to apply again in the future.'
    });

    console.log('Dummy data successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
