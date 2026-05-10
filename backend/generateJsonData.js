const fs = require('fs');
const bcrypt = require('bcrypt');

async function generate() {
  const hashedPwd = await bcrypt.hash('password123', 10);

  const recruiter1Id = '663f7b8e1a1b1c1d1e1f1g1h';
  const recruiter2Id = '663f7b8e1a1b1c1d1e1f1g1i';
  
  const candidate1Id = '663f7b8e1a1b1c1d1e1f1g2a';
  const candidate2Id = '663f7b8e1a1b1c1d1e1f1g2b';
  const candidate3Id = '663f7b8e1a1b1c1d1e1f1g2c';

  const job1Id = '763f7b8e1a1b1c1d1e1f1g1h';
  const job2Id = '763f7b8e1a1b1c1d1e1f1g1i';

  const data = {
    users: [
      { _id: recruiter1Id, username: 'recruiter_alice', password: hashedPwd, role: 'recruiter' },
      { _id: recruiter2Id, username: 'recruiter_bob', password: hashedPwd, role: 'recruiter' },
      { _id: candidate1Id, username: 'candidate_john', password: hashedPwd, role: 'candidate' },
      { _id: candidate2Id, username: 'candidate_jane', password: hashedPwd, role: 'candidate' },
      { _id: candidate3Id, username: 'candidate_alex', password: hashedPwd, role: 'candidate' }
    ],
    jobs: [
      {
        _id: job1Id,
        title: 'Senior Frontend Developer',
        description: 'We are looking for an expert in React, Vite, and modern CSS to lead our frontend team.',
        requirements: '5+ years experience in React. Strong understanding of state management and performance tuning.',
        recruiterId: recruiter1Id,
        createdAt: new Date().toISOString()
      },
      {
        _id: job2Id,
        title: 'Backend Node.js Engineer',
        description: 'Join our team to build scalable microservices using Express, MongoDB, and AWS.',
        requirements: '3+ years experience with Node.js and MongoDB. Experience with REST APIs.',
        recruiterId: recruiter1Id,
        createdAt: new Date().toISOString()
      }
    ],
    applications: [
      {
        _id: '863f7b8e1a1b1c1d1e1f1g1a',
        candidateId: candidate1Id,
        jobId: job1Id,
        resumeText: 'I am a Senior Frontend Developer with 6 years of experience in React, Vite, Redux, and modern CSS architecture. I have led teams of 5 developers.',
        attachmentNotes: 'Looking forward to this opportunity.',
        status: 'Shortlisted',
        matchScore: 92,
        createdAt: new Date().toISOString()
      },
      {
        _id: '863f7b8e1a1b1c1d1e1f1g1b',
        candidateId: candidate2Id,
        jobId: job1Id,
        resumeText: 'I am a backend developer. I know Python, Django, and PostgreSQL. I have never used React.',
        attachmentNotes: 'I am willing to learn.',
        status: 'ScreeningRejected',
        matchScore: 25,
        screeningFeedback: 'Candidate lacks the required frontend skills, specifically React and Vite, as outlined in the job description.',
        createdAt: new Date().toISOString()
      },
      {
        _id: '863f7b8e1a1b1c1d1e1f1g1c',
        candidateId: candidate3Id,
        jobId: job2Id,
        resumeText: 'Experienced Backend Engineer. 4 years of Node.js, Express, and MongoDB. Built multiple scalable REST APIs deployed on AWS.',
        attachmentNotes: 'Ready to join immediately.',
        status: 'InInterview',
        matchScore: 88,
        createdAt: new Date().toISOString()
      },
      {
        _id: '863f7b8e1a1b1c1d1e1f1g1d',
        candidateId: candidate1Id,
        jobId: job2Id,
        resumeText: 'Full stack developer. Good at Node and React.',
        attachmentNotes: '',
        status: 'InterviewRejected',
        matchScore: 75,
        interviewFeedbackSummary: 'Thank you for your time. While your Node.js skills are solid, we found a gap in advanced MongoDB aggregation knowledge required for this specific role. We encourage you to apply again in the future.',
        createdAt: new Date().toISOString()
      }
    ]
  };

  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
  console.log('data.json generated.');
}

generate();
