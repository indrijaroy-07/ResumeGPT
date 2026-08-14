const formidable = require('formidable');
const store = require('../store');
const auth = require('../middleware/auth');

module.exports = async (req, res) => {
  // Only accept POST
  if (req.method !== 'POST') return res.status(405).end();

  const user = auth(req, res);
  if (!user) return; // auth already handled response

  const form = new formidable.IncomingForm();
  form.maxFileSize = 5 * 1024 * 1024; // 5MB

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error', err);
      return res.status(400).json({ msg: 'Failed to parse form' });
    }

    try {
      const jobDescription = fields.jobDescription || '';
      const file = files.resume;
      const fileName = file ? file.originalFilename || file.name : 'uploaded';

      const analysis = {
        id: store.genId(),
        user: user.id,
        fileName,
        jobDescription,
        atsScore: 75,
        jobMatchScore: 70,
        strengths: ['Clear summary', 'Relevant experience'],
        missingSkills: ['Kubernetes', 'GraphQL'],
        suggestions: ['Add metrics', 'Include keywords in bullet points'],
        date: new Date()
      };

      store.analyses.push(analysis);
      res.json(analysis);
    } catch (e) {
      console.error(e);
      res.status(500).json({ msg: 'Server error' });
    }
  });
};
