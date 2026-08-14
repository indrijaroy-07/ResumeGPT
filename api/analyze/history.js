const store = require('../store');
const auth = require('../middleware/auth');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).end();

  const user = auth(req, res);
  if (!user) return;

  try {
    const history = store.analyses.filter(a => a.user === user.id).sort((a,b) => new Date(b.date) - new Date(a.date));
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
