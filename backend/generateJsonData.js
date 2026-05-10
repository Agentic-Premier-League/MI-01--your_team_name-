const fs = require('fs');
const bcrypt = require('bcrypt');

async function generate() {
  const hashedPwd = await bcrypt.hash('password123', 10);

  // Generate generic IDs
  const rIds = Array.from({ length: 3 }, (_, i) => `663f7b8e1a1b1c1d1e1f1r0${i}`);
  const cIds = Array.from({ length: 10 }, (_, i) => `663f7b8e1a1b1c1d1e1f1c${i.toString().padStart(2, '0')}`);
  const jIds = Array.from({ length: 4 }, (_, i) => `763f7b8e1a1b1c1d1e1f1j0${i}`);

  const data = {
    users: [
      { _id: rIds[0], username: 'recruiter_alice', password: hashedPwd, role: 'recruiter' },
      { _id: rIds[1], username: 'recruiter_bob', password: hashedPwd, role: 'recruiter' },
      { _id: rIds[2], username: 'recruiter_carol', password: hashedPwd, role: 'recruiter' },
      { _id: cIds[0], username: 'candidate_john', password: hashedPwd, role: 'candidate' },
      { _id: cIds[1], username: 'candidate_jane', password: hashedPwd, role: 'candidate' },
      { _id: cIds[2], username: 'candidate_alex', password: hashedPwd, role: 'candidate' },
      { _id: cIds[3], username: 'candidate_sarah', password: hashedPwd, role: 'candidate' },
      { _id: cIds[4], username: 'candidate_mike', password: hashedPwd, role: 'candidate' },
      { _id: cIds[5], username: 'candidate_emily', password: hashedPwd, role: 'candidate' },
      { _id: cIds[6], username: 'candidate_david', password: hashedPwd, role: 'candidate' },
      { _id: cIds[7], username: 'candidate_lisa', password: hashedPwd, role: 'candidate' },
      { _id: cIds[8], username: 'candidate_tom', password: hashedPwd, role: 'candidate' },
      { _id: cIds[9], username: 'candidate_emma', password: hashedPwd, role: 'candidate' }
    ],
    jobs: [
      {
        _id: jIds[0],
        title: 'Senior Frontend Developer',
        description: 'We are looking for an expert in React, Vite, and modern CSS to lead our frontend team.',
        requirements: '5+ years experience in React. Strong understanding of state management and performance tuning.',
        recruiterId: rIds[0],
        createdAt: new Date().toISOString()
      },
      {
        _id: jIds[1],
        title: 'Backend Node.js Engineer',
        description: 'Join our team to build scalable microservices using Express, MongoDB, and AWS.',
        requirements: '3+ years experience with Node.js and MongoDB. Experience with REST APIs.',
        recruiterId: rIds[0],
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        _id: jIds[2],
        title: 'Full Stack Web Developer',
        description: 'Looking for a generalist to work on end-to-end features using the MERN stack.',
        requirements: 'Experience with MongoDB, Express, React, Node.js. Good UI/UX sense.',
        recruiterId: rIds[1],
        createdAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        _id: jIds[3],
        title: 'DevOps Engineer',
        description: 'We need someone to manage our CI/CD pipelines and AWS infrastructure.',
        requirements: 'Experience with Docker, Kubernetes, GitHub Actions, and AWS.',
        recruiterId: rIds[0],
        createdAt: new Date(Date.now() - 259200000).toISOString()
      }
    ],
    applications: [
      {
        _id: '863f7b8e1a1b1c1d1e1f1g1a', candidateId: cIds[0], jobId: jIds[0],
        resumeText: 'I am a Senior Frontend Developer with 6 years of experience in React, Vite, Redux, and modern CSS architecture. I have led teams of 5 developers.',
        attachmentNotes: 'Looking forward to this opportunity.',
        status: 'Hired', matchScore: 92, createdAt: new Date().toISOString()
      },
      {
        _id: '863f7b8e1a1b1c1d1e1f1g1b', candidateId: cIds[1], jobId: jIds[0],
        resumeText: 'I am a backend developer. I know Python, Django, and PostgreSQL. I have never used React.',
        attachmentNotes: 'I am willing to learn.',
        status: 'ScreeningRejected', matchScore: 25,
        screeningFeedback: 'Candidate lacks the required frontend skills, specifically React and Vite, as outlined in the job description.',
        createdAt: new Date().toISOString()
      },
      {
        _id: '863f7b8e1a1b1c1d1e1f1g1c', candidateId: cIds[2], jobId: jIds[0],
        resumeText: 'I am a junior frontend dev. I know HTML, CSS, and some React basics.',
        attachmentNotes: '',
        status: 'ScreeningRejected', matchScore: 45,
        screeningFeedback: 'Candidate does not meet the 5+ years seniority requirement and lacks advanced state management knowledge.',
        createdAt: new Date().toISOString()
      },
      {
        _id: '863f7b8e1a1b1c1d1e1f1g1d', candidateId: cIds[3], jobId: jIds[0],
        resumeText: 'React expert with 4 years of experience building high-performance UIs using Vite and Redux.',
        attachmentNotes: 'Available to start immediately.',
        status: 'InInterview', matchScore: 85, createdAt: new Date().toISOString()
      },
      {
        _id: '863f7b8e1a1b1c1d1e1f1g1e', candidateId: cIds[4], jobId: jIds[0],
        resumeText: 'Frontend engineer with strong Angular background. Recently started learning React.',
        attachmentNotes: '',
        status: 'Applied', matchScore: 65, createdAt: new Date().toISOString()
      },
      // Job 2 Applications (Node.js)
      {
        _id: '863f7b8e1a1b1c1d1e1f1g2a', candidateId: cIds[5], jobId: jIds[1],
        resumeText: 'Experienced Backend Engineer. 4 years of Node.js, Express, and MongoDB. Built multiple scalable REST APIs deployed on AWS.',
        attachmentNotes: 'Ready to join immediately.',
        status: 'Shortlisted', matchScore: 88, createdAt: new Date().toISOString()
      },
      {
        _id: '863f7b8e1a1b1c1d1e1f1g2b', candidateId: cIds[6], jobId: jIds[1],
        resumeText: 'Full stack developer. Good at Node and React.',
        attachmentNotes: '',
        status: 'InterviewRejected', matchScore: 75,
        interviewFeedbackSummary: 'Thank you for your time. While your Node.js skills are solid, we found a gap in advanced MongoDB aggregation knowledge required for this specific role. We encourage you to apply again in the future.',
        createdAt: new Date().toISOString()
      },
      {
        _id: '863f7b8e1a1b1c1d1e1f1g2c', candidateId: cIds[7], jobId: jIds[1],
        resumeText: 'Java developer looking to switch to Node.js.',
        attachmentNotes: '',
        status: 'ScreeningRejected', matchScore: 30,
        screeningFeedback: 'Candidate does not have the required 3+ years of professional Node.js and MongoDB experience.',
        createdAt: new Date().toISOString()
      },
      {
        _id: '863f7b8e1a1b1c1d1e1f1g2d', candidateId: cIds[8], jobId: jIds[1],
        resumeText: 'Senior Node.js architect. 7 years experience designing distributed systems on AWS with MongoDB and Redis.',
        attachmentNotes: 'Can lead the backend team.',
        status: 'InInterview', matchScore: 98, createdAt: new Date().toISOString()
      },
      {
        _id: '863f7b8e1a1b1c1d1e1f1g2e', candidateId: cIds[9], jobId: jIds[1],
        resumeText: 'Node.js developer. Worked on a few Express projects.',
        attachmentNotes: '',
        status: 'Applied', matchScore: 60, createdAt: new Date().toISOString()
      }
    ]
  };

  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
  console.log('data.json generated with 3 recruiters, 10 candidates, 4 jobs, and 10 applications.');
}

generate();
