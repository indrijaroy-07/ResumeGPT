import { useState, useEffect } from 'react';
import { UploadCloud, FileText, CheckCircle2, Play, History, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import axios from 'axios';

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [githubProfile, setGithubProfile] = useState(null);
  const [githubInput, setGithubInput] = useState('');
  const [githubError, setGithubError] = useState('');
  const [isVerifyingGithub, setIsVerifyingGithub] = useState(false);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  });

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    const githubUsername = user?.github || githubInput;

    if (!githubUsername) {
      setGithubProfile(null);
      setGithubInput('');
      return;
    }

    setGithubInput(githubUsername);

    const fetchGithubProfile = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${githubUsername}`, {
          headers: {
            'User-Agent': 'AI-Resume-Analyzer',
            Accept: 'application/vnd.github+json',
          },
        });

        if (!response.ok) {
          throw new Error('GitHub profile not found');
        }

        const profile = await response.json();
        setGithubProfile(profile);
      } catch (err) {
        console.error('Error fetching GitHub profile:', err);
        setGithubProfile(null);
      }
    };

    fetchGithubProfile();
  }, [user?.github]);

  const normalizeGithubUsername = (value = '') => {
    const clean = String(value || '').trim();

    if (!clean) return '';

    return clean
      .replace(/^@/, '')
      .replace(/^https?:\/\/github\.com\//i, '')
      .replace(/^github\.com\//i, '')
      .replace(/\/+$/, '')
      .split(/[/?#]/)[0]
      .trim();
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/analyze/history', {
        headers: { 'x-auth-token': token }
      });
      setHistory(res.data);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  const handleGithubVerify = async () => {
    const normalized = normalizeGithubUsername(githubInput);

    if (!normalized) {
      setGithubError('Enter a valid GitHub username or URL.');
      setGithubProfile(null);
      return;
    }

    setIsVerifyingGithub(true);
    setGithubError('');

    try {
      const response = await fetch(`https://api.github.com/users/${normalized}`, {
        headers: {
          'User-Agent': 'AI-Resume-Analyzer',
          Accept: 'application/vnd.github+json',
        },
      });

      if (!response.ok) {
        throw new Error('GitHub user not found');
      }

      const profile = await response.json();
      const token = localStorage.getItem('token');
      const backendResponse = await axios.put(
        '/api/auth/github',
        { github: normalized },
        { headers: { 'x-auth-token': token } }
      );

      const nextUser = { ...user, github: backendResponse.data.user.github || normalized };
      setUser(nextUser);
      localStorage.setItem('user', JSON.stringify(nextUser));
      setGithubProfile(profile);
      setGithubInput(nextUser.github);
    } catch (err) {
      setGithubError(err.response?.data?.msg || 'This GitHub profile could not be verified. Please check the username and try again.');
      setGithubProfile(null);
    } finally {
      setIsVerifyingGithub(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !jobDescription) return;
    
    setIsAnalyzing(true);
    setError('');
    
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/analyze', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token 
        }
      });
      setAnalysisResult(res.data);
      fetchHistory(); // Refresh history
    } catch (err) {
      setError(err.response?.data?.msg || 'Error analyzing resume');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-2">Upload your resume and the job description you're applying for to get AI-powered insights.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Input Column */}
          <div className="space-y-6">
            
            {/* Upload Area */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Resume Upload
              </h2>
              <div className="relative border-2 border-dashed border-primary/30 rounded-xl p-8 hover:bg-primary/5 transition-colors group cursor-pointer text-center">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="p-3 bg-primary/10 text-primary rounded-full group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  {file ? (
                    <div>
                      <p className="font-medium text-slate-800">{file.name}</p>
                      <p className="text-xs text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium text-slate-800">Click to upload or drag and drop</p>
                      <p className="text-sm text-slate-500 mt-1">PDF, DOC, or DOCX (max. 5MB)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-primary text-xs font-bold">GH</span>
                GitHub Profile
              </h2>

              <div className="space-y-3">
                <label htmlFor="githubInput" className="block text-sm font-medium text-slate-700">
                  GitHub username
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    id="githubInput"
                    type="text"
                    value={githubInput}
                    onChange={(e) => {
                      setGithubInput(e.target.value);
                      if (githubError) setGithubError('');
                    }}
                    placeholder="octocat or https://github.com/octocat"
                    className="flex-1 appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-shadow"
                  />
                  <button
                    type="button"
                    onClick={handleGithubVerify}
                    disabled={isVerifyingGithub}
                    className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {isVerifyingGithub ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
                <p className="text-xs text-slate-500">Enter a GitHub username or full profile URL to validate the account before AI review.</p>

                {githubError && (
                  <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg p-2">{githubError}</p>
                )}
              </div>

              {githubProfile ? (
                <div className="mt-5 space-y-4 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={githubProfile.avatar_url}
                      alt={githubProfile.login}
                      className="h-16 w-16 rounded-full border border-slate-200"
                    />
                    <div>
                      <a
                        href={githubProfile.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-slate-800 hover:text-primary"
                      >
                        {githubProfile.name || githubProfile.login}
                      </a>
                      <p className="text-sm text-slate-500">@{githubProfile.login}</p>
                    </div>
                  </div>

                  {githubProfile.bio && (
                    <p className="text-sm text-slate-600">{githubProfile.bio}</p>
                  )}

                  <div className="grid grid-cols-3 gap-3 text-center text-sm">
                    <div className="rounded-xl bg-slate-50 p-2">
                      <div className="font-semibold text-slate-800">{githubProfile.public_repos}</div>
                      <div className="text-slate-500">Repos</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2">
                      <div className="font-semibold text-slate-800">{githubProfile.followers}</div>
                      <div className="text-slate-500">Followers</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2">
                      <div className="font-semibold text-slate-800">{githubProfile.following}</div>
                      <div className="text-slate-500">Following</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  No verified GitHub profile yet. Enter a username and verify it to include GitHub evidence in the AI review.
                </div>
              )}
            </div>

            {/* Job Description Area */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Job Description
              </h2>
              <textarea
                rows="6"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm text-slate-700"
                placeholder="Paste the target job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              ></textarea>
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={!file || !jobDescription || isAnalyzing}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-medium text-lg transition-all shadow-md ${
                !file || !jobDescription
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary-dark hover:-translate-y-0.5 shadow-primary/30'
              }`}
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-2 animate-pulse">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Analyzing...
                </div>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  Analyze Resume
                </>
              )}
            </button>
          </div>

          {/* Results Column */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Analysis Results</h2>
            
            {error && <p className="mb-4 text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}
            
            {!analysisResult ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50">
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-slate-700 font-medium mb-2">No Analysis Yet</h3>
                <p className="text-sm text-slate-500">Upload your resume and a job description to get a detailed match report and improvement suggestions.</p>
              </div>
            ) : (
              <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-xl">
                  <div>
                    <h3 className="text-green-800 font-semibold text-lg">{analysisResult.jobMatchScore}% Match Score</h3>
                    <p className="text-green-600 text-sm">ATS Score: {analysisResult.atsScore}%</p>
                  </div>
                  <div className="relative w-16 h-16 flex items-center justify-center bg-white rounded-full border-[4px] border-green-400">
                     <span className="text-green-600 font-bold">{analysisResult.jobMatchScore}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Key Strengths
                  </h3>
                  <ul className="space-y-2">
                    {analysisResult.strengths.map((s, i) => (
                      <li key={i} className="flex gap-2 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-slate-800 flex items-center gap-2">
                    <History className="w-4 h-4 text-blue-500" />
                    Missing Skills
                  </h3>
                  <ul className="space-y-2">
                    {analysisResult.missingSkills.map((s, i) => (
                      <li key={i} className="flex gap-2 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-slate-800">AI Suggestions</h3>
                  <ul className="space-y-2">
                    {analysisResult.suggestions.map((s, i) => (
                      <li key={i} className="flex gap-2 text-sm text-slate-600">
                        <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                        </div>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* History Section */}
        {history.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <History className="w-6 h-6" />
              Recent Analyses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map((item) => (
                <div 
                  key={item._id} 
                  className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between hover:border-primary/30 transition-colors cursor-pointer"
                  onClick={() => setAnalysisResult(item)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-slate-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 truncate max-w-[150px]">{item.fileName}</h4>
                      <p className="text-xs text-slate-500">{new Date(item.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-primary">{item.jobMatchScore}%</span>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Match</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
