const Url = require('../models/url');

exports.createShortUrl = async (req, res) => {
  const { original } = req.body;
  if (!original) return res.status(400).json({ error: 'Original URL required' });
  const short = Math.random().toString(36).substring(2, 8);
  try {
    const url = await Url.create({ short, original });
    res.json({ short: url.short, original: url.original });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

exports.redirectShortUrl = async (req, res) => {
  const { short } = req.params;
  const url = await Url.findOne({ where: { short } });
  if (!url) return res.status(404).send('Not found');
  res.redirect(url.original);
};
