const Analysis = require('../models/Analysis');
const pdf = require('pdf-parse').PDFParse;
const mammoth = require('mammoth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

exports.analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'Please upload a resume file' });
    }

    const { jobDescription } = req.body;
    let resumeText = '';

    try {
      // Extract text based on file type
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

    const prompt = `You are an expert resume reviewer. Analyze the following resume and return ONLY a JSON object with these fields:
{
  "atsScore": number (0-100),
  "jobMatchScore": number (0-100),
  "strengths": [list of strings],
  "missingSkills": [list of strings],
  "suggestions": [list of strings]
}
Resume: ${resumeText}
Job Description: ${jobDescription || 'Not provided'}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();
    console.log('AI raw response:', content);

    let analysisResult;
    try {
      // Find JSON block if it's wrapped in markdown
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : content;
      analysisResult = JSON.parse(jsonStr);
      
      // Ensure all required fields exist
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

    // Save to database
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
