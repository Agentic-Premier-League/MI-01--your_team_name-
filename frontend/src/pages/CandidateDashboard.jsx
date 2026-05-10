import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare } from 'lucide-react';

const CandidateDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Chatbot state
  const [chatAppId, setChatAppId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
    fetchMyApplications();
  }, []);

  const fetchJobs = async () => {
    const res = await axios.get('http://localhost:5001/api/jobs');
    setJobs(res.data);
  };

  const fetchMyApplications = async () => {
    const res = await axios.get('http://localhost:5001/api/applications/my');
    setMyApplications(res.data);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5001/api/applications', {
        jobId: selectedJob._id,
        resumeText,
        attachmentNotes: notes
      });
      alert('Application submitted and AI screening complete!');
      setSelectedJob(null);
      setResumeText('');
      fetchMyApplications();
    } catch (err) {
      alert('Error applying');
    }
    setLoading(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    const userMsg = { role: 'user', content: currentMessage };
    const newHistory = [...chatMessages, userMsg];
    setChatMessages(newHistory);
    setCurrentMessage('');
    setChatLoading(true);

    try {
      const res = await axios.post('http://localhost:5001/api/chat', {
        applicationId: chatAppId,
        message: userMsg.content,
        history: chatMessages
      });
      setChatMessages([...newHistory, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      setChatMessages([...newHistory, { role: 'assistant', content: 'Sorry, I encountered an error.' }]);
    }
    setChatLoading(false);
  };

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Candidate Dashboard</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Jobs List */}
        <div>
          <h3>Available Jobs</h3>
          {jobs.map(job => (
            <div key={job._id} className="card" style={{ marginBottom: '1rem', marginTop: '1rem' }}>
              <h4>{job.title}</h4>
              <p style={{ color: 'var(--text-muted)' }}>{job.description.substring(0, 100)}...</p>
              <button 
                onClick={() => setSelectedJob(job)} 
                className="btn btn-primary" 
                style={{ marginTop: '1rem' }}
              >
                Apply
              </button>
            </div>
          ))}
        </div>

        {/* My Applications */}
        <div>
          <h3>My Applications</h3>
          {myApplications.map(app => (
            <div key={app._id} className="card" style={{ marginBottom: '1rem', marginTop: '1rem' }}>
              <h4>{app.jobId?.title}</h4>
              <p>Status: <strong style={{ color: app.status.includes('Rejected') ? 'var(--danger)' : 'var(--success)' }}>{app.status}</strong></p>
              
              {app.status === 'ScreeningRejected' && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
                  <strong>AI Feedback:</strong> {app.screeningFeedback}
                </div>
              )}

              {app.status === 'InterviewRejected' && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
                  <strong>Feedback:</strong> {app.interviewFeedbackSummary}
                </div>
              )}

              <button 
                className="btn" 
                style={{ background: 'var(--border)', marginTop: '1rem', display: 'flex', gap: '0.5rem' }}
                onClick={() => {
                  setChatAppId(app._id);
                  setChatMessages([{ role: 'assistant', content: `Hi! Ask me anything about the ${app.jobId.title} role and your application.` }]);
                }}
              >
                <MessageSquare size={16} /> Chat about this role
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Apply Modal overlay simulation */}
      {selectedJob && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="card" style={{ width: '500px' }}>
            <h2>Apply for {selectedJob.title}</h2>
            <form onSubmit={handleApply} style={{ marginTop: '1rem' }}>
              <textarea 
                placeholder="Paste your Resume text here..." 
                className="input" 
                rows="6" 
                required 
                value={resumeText} 
                onChange={e => setResumeText(e.target.value)} 
              />
              <textarea 
                placeholder="Additional Notes" 
                className="input" 
                rows="2" 
                value={notes} 
                onChange={e => setNotes(e.target.value)} 
              />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'AI Screening...' : 'Submit Application'}
                </button>
                <button type="button" className="btn btn-danger" onClick={() => setSelectedJob(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {chatAppId && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '350px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', zIndex: 1000 }}>
          <div style={{ background: 'var(--primary)', padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            <h4 style={{ margin: 0, color: 'white' }}>AI Assistant</h4>
            <button onClick={() => setChatAppId(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>✕</button>
          </div>
          <div style={{ height: '300px', overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {chatMessages.map((msg, i) => (
              <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', background: msg.role === 'user' ? 'var(--primary)' : 'var(--border)', padding: '0.5rem 1rem', borderRadius: '1rem', maxWidth: '80%' }}>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>{msg.content}</p>
              </div>
            ))}
            {chatLoading && <div style={{ color: 'var(--text-muted)' }}>Thinking...</div>}
          </div>
          <form onSubmit={handleSendMessage} style={{ display: 'flex', borderTop: '1px solid var(--border)' }}>
            <input 
              type="text" 
              value={currentMessage} 
              onChange={e => setCurrentMessage(e.target.value)} 
              placeholder="Type a message..." 
              style={{ flex: 1, padding: '1rem', background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none' }} 
            />
            <button type="submit" className="btn btn-primary" style={{ borderRadius: 0 }}>Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CandidateDashboard;
