import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');

  const COLORS = ['#4F46E5', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, statsRes] = await Promise.all([
        axios.get('http://localhost:5001/api/jobs'),
        axios.get('http://localhost:5001/api/analytics')
      ]);
      setJobs(jobsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/jobs', { title, description, requirements });
      setTitle('');
      setDescription('');
      setRequirements('');
      fetchData();
    } catch (err) {
      alert('Error creating job');
    }
  };

  const prepareChartData = () => {
    if (!stats) return [];
    return Object.keys(stats).map(key => ({ name: key, value: stats[key] }));
  };

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Recruiter Dashboard</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Analytics */}
        <div className="card">
          <h3>Recruitment Analytics</h3>
          {stats ? (
            <div style={{ height: '300px', marginTop: '1rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepareChartData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {prepareChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', border: 'none', borderRadius: '8px' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p>Loading analytics...</p>
          )}
        </div>

        {/* Create Job Form */}
        <div className="card">
          <h3>Post a New Job</h3>
          <form onSubmit={handleCreateJob} style={{ marginTop: '1rem' }}>
            <input type="text" placeholder="Job Title" className="input" required value={title} onChange={e => setTitle(e.target.value)} />
            <textarea placeholder="Job Description" className="input" rows="3" required value={description} onChange={e => setDescription(e.target.value)} />
            <textarea placeholder="Requirements" className="input" rows="3" required value={requirements} onChange={e => setRequirements(e.target.value)} />
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Job</button>
          </form>
        </div>
      </div>

      <h3 style={{ marginTop: '3rem', marginBottom: '1rem' }}>Your Posted Jobs</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {jobs.map(job => (
          <div key={job._id} className="card">
            <h4>{job.title}</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0 1rem 0' }}>Posted: {new Date(job.createdAt).toLocaleDateString()}</p>
            <Link to={`/jobs/${job._id}`} className="btn btn-primary" style={{ textDecoration: 'none' }}>
              View Candidates
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
