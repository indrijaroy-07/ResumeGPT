const Analysis = require('../models/Analysis');
const User = require('../models/User');
const pdf = require('pdf-parse').PDFParse;
const mammoth = require('mammoth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const normalizeGithubUsername = (github = '') => {
  const value = String(github || '').trim();

  if (!value) {
    return '';
  }

  return value
    .replace(/^@/, '')
    .replace(/^https?:\/\/github\.com\//i, '')
    .replace(/^github\.com\//i, '')
    .replace(/\/+$/, '')
    .split(/[/?#]/)[0]
    .trim();
};

const fetchGithubProfileSummary = async (githubUsername) => {
  const username = normalizeGithubUsername(githubUsername);

  if (!username) {
    return 'No public GitHub profile provided.';
  }

  try {
    const headers = {
      'User-Agent': 'AI-Resume-Analyzer',
      Accept: 'application/vnd.github+json',
    };

    const profileResponse = await fetch(`https://api.github.com/users/${username}`, { headers });

    if (!profileResponse.ok) {
      return `GitHub profile for ${username} could not be fetched.`;
    }

    const profile = await profileResponse.json();
    let summary = `GitHub user: ${profile.login}${profile.name ? ` (${profile.name})` : ''}.`;

    if (profile.bio) summary += ` Bio: ${profile.bio}.`;
    if (profile.company) summary += ` Company: ${profile.company}.`;
    if (profile.location) summary += ` Location: ${profile.location}.`;
    if (profile.public_repos !== undefined) summary += ` Public repos: ${profile.public_repos}.`;
    if (profile.followers !== undefined) summary += ` Followers: ${profile.followers}.`;
    if (profile.html_url) summary += ` Profile: ${profile.html_url}.`;

    const reposResponse = await fetch(`${profile.repos_url}?per_page=5&sort=updated`, { headers });

    if (reposResponse.ok) {
      const repos = await reposResponse.json();
      if (Array.isArray(repos) && repos.length > 0) {
        const topRepos = repos.slice(0, 5).map((repo) => {
          const repoSummary = repo.description ? `: ${repo.description}` : '';
          const language = repo.language ? ` (${repo.language})` : '';
          const stars = repo.stargazers_count ? `, stars ${repo.stargazers_count}` : '';
          return `- ${repo.name}${repoSummary}${language}${stars}`;
        }).join('; ');

        summary += ` Recent public repos: ${topRepos}.`;
      }
    }

    return summary;
  } catch (error) {
    console.warn('GitHub profile fetch failed:', error.message);
    return `GitHub profile ${username} was unavailable at analysis time.`;
  }
};

exports.analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'Please upload a resume file' });
    }

    const { jobDescription } = req.body;
    let resumeText = '';

    try {
      if (req.file.mimetype === 'application/pdf') {
        const parser = new pdf({ data: req.file.buffer });
        const data = await parser.getText();
        resumeText = data.text;
      } else if (
        req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        req.file.mimetype === 'application/msword'
      ) {
        const data = await mammoth.extractRawText({ buffer: req.file.buffer });
        resumeText = data.value;
      } else {
        return res.status(400).json({ msg: 'Unsupported file format. Please upload PDF or DOCX.' });
      }

      console.log('Successfully extracted resume text. Length:', resumeText.length);
    } catch (extractError) {
      console.error('Extraction Error:', extractError);
      return res.status(400).json({ msg: 'Failed to extract text from file: ' + extractError.message });
    }

    const user = await User.findById(req.user.id).select('github');
    const githubProfileSummary = await fetchGithubProfileSummary(user?.github);

    const prompt = `You are an expert resume reviewer. Evaluate the candidate using BOTH the resume and their public GitHub profile when available. Return ONLY a JSON object with these fields:
{
  "atsScore": number (0-100),
  "jobMatchScore": number (0-100),
  "strengths": [list of strings],
  "missingSkills": [list of strings],
  "suggestions": [list of strings]
}
Resume: ${resumeText}
Job Description: ${jobDescription || 'Not provided'}
GitHub Profile: ${githubProfileSummary}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();
    console.log('AI raw response:', content);

    let analysisResult;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : content;
      analysisResult = JSON.parse(jsonStr);

      const defaults = {
        atsScore: 0,
        jobMatchScore: 0,
        strengths: [],
        missingSkills: [],
        suggestions: []
      };
      analysisResult = { ...defaults, ...analysisResult };
    } catch (parseError) {
      console.error('Error parsing Gemini response:', content);
      return res.status(500).json({
        msg: 'AI returned an invalid format.',
        debug: content.substring(0, 100)
      });
    }

    const newAnalysis = new Analysis({
      user: req.user.id,
      fileName: req.file.originalname,
      jobDescription: jobDescription || '',
      ...analysisResult
    });

    await newAnalysis.save();

    res.json(newAnalysis);
  } catch (err) {
    console.error('Detailed Analysis Error:', err);
    res.status(500).json({ msg: err.message || 'Server error during analysis' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await Analysis.find({ user: req.user.id }).sort({ date: -1 });
    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports.normalizeGithubUsername = normalizeGithubUsername;
module.exports.fetchGithubProfileSummary = fetchGithubProfileSummary;
