import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  
  // Reject Modal State
  const [rejectModalAppId, setRejectModalAppId] = useState(null);
  const [techScore, setTechScore] = useState('3');
  const [knowledgeGap, setKnowledgeGap] = useState('3');
  const [additionalComment, setAdditionalComment] = useState('');
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const jobRes = await axios.get(`http://localhost:5001/api/jobs/${id}`);
      setJob(jobRes.data);
      
      const candidatesRes = await axios.get(`http://localhost:5001/api/jobs/${id}/candidates`);
      setCandidates(candidatesRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (appId, status) => {
    try {
      await axios.put(`http://localhost:5001/api/applications/${appId}/status`, { status });
      fetchData();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleInterviewReject = async (e) => {
    e.preventDefault();
    setLoadingFeedback(true);
    try {
      await axios.post(`http://localhost:5001/api/applications/${rejectModalAppId}/interview-reject`, {
        techScore,
        knowledgeGap,
        additionalComment
      });
      setRejectModalAppId(null);
      setTechScore('3');
      setKnowledgeGap('3');
      setAdditionalComment('');
      fetchData();
    } catch (err) {
      alert('Error submitting feedback');
    }
    setLoadingFeedback(false);
  };

  if (!job) return <div>Loading...</div>;

  return (
    <div>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: 'white', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>{job.title}</h2>
        <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div>
            <h4 style={{ color: 'var(--primary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem' }}>Job Description</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>{job.description}</p>
          </div>
          <div>
            <h4 style={{ color: 'var(--primary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem' }}>Requirements</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{job.requirements}</p>
          </div>
        </div>
      </div>

      <h3>Ranked Candidates</h3>
      {candidates.length === 0 && <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>No candidates yet.</p>}
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        {candidates.map((app, index) => (
          <div key={app._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h4 style={{ margin: 0 }}>
                  #{index + 1} {app.candidateId?.username} 
                </h4>
                <span style={{ 
                  background: 'var(--primary)', 
                  color: 'white', 
                  padding: '0.2rem 0.5rem', 
                  borderRadius: '1rem', 
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  Score: {app.matchScore}%
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Status: {app.status}
                </span>
              </div>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {app.resumeText.substring(0, 150)}...
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {app.status === 'Shortlisted' && (
                <button onClick={() => updateStatus(app._id, 'InInterview')} className="btn btn-primary">Move to Interview</button>
              )}
              {app.status === 'InInterview' && (
                <>
                  <button onClick={() => updateStatus(app._id, 'Hired')} className="btn btn-success">Hire</button>
                  <button onClick={() => setRejectModalAppId(app._id)} className="btn btn-danger">Reject</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reject & Feedback Modal */}
      {rejectModalAppId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="card" style={{ width: '500px' }}>
            <h2>Provide Interview Feedback</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Our AI will summarize this into a polite rejection letter for the candidate.</p>
            
            <form onSubmit={handleInterviewReject}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Technical Score (1-5): {techScore}</label>
                <input type="range" min="1" max="5" value={techScore} onChange={e => setTechScore(e.target.value)} style={{ width: '100%' }} />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Knowledge Gap (1-5): {knowledgeGap}</label>
                <input type="range" min="1" max="5" value={knowledgeGap} onChange={e => setKnowledgeGap(e.target.value)} style={{ width: '100%' }} />
              </div>
              
              <textarea 
                placeholder="Additional comments or context..." 
                className="input" 
                rows="4" 
                value={additionalComment} 
                onChange={e => setAdditionalComment(e.target.value)} 
                required 
              />
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary" disabled={loadingFeedback}>
                  {loadingFeedback ? 'AI Generating Feedback...' : 'Submit Rejection'}
                </button>
                <button type="button" className="btn" style={{ background: 'var(--border)' }} onClick={() => setRejectModalAppId(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
